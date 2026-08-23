import json
from typing import Dict, Any, List, Tuple

def evaluate_condition(user_val: Any, condition: Any) -> str:
    """
    Evaluates a single condition.
    Returns "PASS", "FAIL", or "UNKNOWN"
    """
    if user_val is None or user_val == "":
        return "UNKNOWN"
        
    if isinstance(condition, dict):
        # Range or complex condition
        if "min" in condition and "max" in condition:
            if isinstance(user_val, (int, float)):
                if condition["min"] <= user_val <= condition["max"]:
                    return "PASS"
                return "FAIL"
            else:
                return "UNKNOWN" # Invalid type
        if "max" in condition:
            if isinstance(user_val, (int, float)):
                if user_val <= condition["max"]:
                    return "PASS"
                return "FAIL"
            else:
                return "UNKNOWN"
        if "min" in condition:
            if isinstance(user_val, (int, float)):
                if user_val >= condition["min"]:
                    return "PASS"
                return "FAIL"
            else:
                return "UNKNOWN"
                
    elif isinstance(condition, list):
        # Enum condition
        if str(user_val).lower() in [str(c).lower() for c in condition]:
            return "PASS"
        return "FAIL"
        
    else:
        # Boolean or exact match
        if str(user_val).lower() == str(condition).lower():
            return "PASS"
        return "FAIL"

def evaluate_scheme(profile: Dict[str, Any], scheme: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluates a profile against a scheme's criteria.
    """
    required = scheme.get("eligibility", {}).get("required_criteria", {})
    optional = scheme.get("eligibility", {}).get("optional_criteria", {})
    
    matched_criteria = []
    failed_criteria = []
    missing_info = []
    
    overall_status = "ELIGIBLE"
    
    # Evaluate required criteria
    for key, condition in required.items():
        if key == "any_of":
            # condition is a list of criteria dicts, e.g. [{"socialCategory": ["SC", "ST"]}, {"gender": ["Female"]}]
            passes = 0
            unknowns = 0
            for group in condition:
                group_passes = True
                group_unknowns = False
                for g_k, g_c in group.items():
                    u_val = profile.get(g_k)
                    st = evaluate_condition(u_val, g_c)
                    if st == "FAIL":
                        group_passes = False
                        break
                    elif st == "UNKNOWN":
                        group_passes = False
                        group_unknowns = True
                
                if group_passes:
                    passes += 1
                elif group_unknowns:
                    unknowns += 1
            
            if passes > 0:
                # Collect which groups actually matched for display
                for group in condition:
                    for g_k in group.keys():
                        u_val = profile.get(g_k)
                        if evaluate_condition(u_val, group[g_k]) == "PASS":
                            if g_k not in matched_criteria:
                                matched_criteria.append(g_k)
            elif unknowns > 0:
                # Report the actual unknown fields so the UI can ask for them
                for group in condition:
                    group_unknown_fields = []
                    group_failed = False
                    for g_k, g_c in group.items():
                        u_val = profile.get(g_k)
                        st = evaluate_condition(u_val, g_c)
                        if st == "FAIL":
                            group_failed = True
                            break
                        elif st == "UNKNOWN":
                            group_unknown_fields.append(g_k)
                    if not group_failed:
                        for f in group_unknown_fields:
                            if f not in missing_info and f not in matched_criteria:
                                missing_info.append(f)
                if overall_status != "NOT_ELIGIBLE":
                    overall_status = "NEEDS_MORE_INFO"
            else:
                # All groups failed — pick the first group's fields as explanation
                first_group_keys = list(condition[0].keys()) if condition else []
                for k in first_group_keys:
                    if k not in failed_criteria:
                        failed_criteria.append(k)
                overall_status = "NOT_ELIGIBLE"
            continue

        user_val = profile.get(key)
        status = evaluate_condition(user_val, condition)
        
        if status == "FAIL":
            failed_criteria.append(key)
            overall_status = "NOT_ELIGIBLE"
        elif status == "UNKNOWN":
            missing_info.append(key)
            if overall_status != "NOT_ELIGIBLE":
                overall_status = "NEEDS_MORE_INFO"
        elif status == "PASS":
            matched_criteria.append(key)

    # Evaluate optional/relevance criteria
    for key, condition in optional.items():
        user_val = profile.get(key)
        status = evaluate_condition(user_val, condition)
        
        if status == "PASS":
            matched_criteria.append(key)
        elif status == "FAIL":
            pass # Optional criteria failing does not fail the scheme
            
    # Calculate relevance score
    # Score = (number of matched criteria / total number of criteria) * 100
    # Add a base score for being eligible
    total_criteria = len(required) + len(optional)
    relevance_score = 0
    if total_criteria > 0:
        relevance_score = int((len(matched_criteria) / total_criteria) * 100)
        
    # Boost score if they have highly specific matches
    if overall_status == "ELIGIBLE":
        relevance_score = min(100, relevance_score + 20)
        
    return {
        "scheme_id": scheme["id"],
        "scheme": scheme,
        "eligibility_status": overall_status,
        "relevance_score": relevance_score,
        "matched_criteria": matched_criteria,
        "failed_criteria": failed_criteria,
        "missing_information": missing_info
    }

def analyze_profile(profile: Dict[str, Any], schemes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Analyzes the profile against all schemes and ranks them.
    """
    results = []
    for scheme in schemes:
        res = evaluate_scheme(profile, scheme)
        results.append(res)
        
    # Sort by overall status (ELIGIBLE > NEEDS_MORE_INFO > NOT_ELIGIBLE), then by relevance score
    def sort_key(r):
        status_rank = {"ELIGIBLE": 3, "NEEDS_MORE_INFO": 2, "NOT_ELIGIBLE": 1}
        return (status_rank.get(r["eligibility_status"], 0), r["relevance_score"])
        
    results.sort(key=sort_key, reverse=True)
    return results
