"""
Supabase の reflections テーブルを REST API 経由で作成するスクリプト。
Management API（/rest/v1/rpc）ではなく、SQL Editor API を使用。
"""
import requests
import json

SUPABASE_URL = "https://ngqtckesmoyngweezxac.supabase.co"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXRja2VzbW95bmd3ZWV6eGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNTcxNzMsImV4cCI6MjA2NjkzMzE3M30.h2QLdm_VhKxaeb2S6c9dPtnRG6adcgMRWu-dXJ64TRw"

headers = {
    "apikey": ANON_KEY,
    "Authorization": f"Bearer {ANON_KEY}",
    "Content-Type": "application/json",
}

# テーブルが存在するか確認
def check_table():
    resp = requests.get(
        f"{SUPABASE_URL}/rest/v1/reflections?limit=1",
        headers=headers,
    )
    return resp.status_code == 200

# テスト用レコードを1件挿入して動作確認
def test_insert():
    payload = {
        "student_name": "テスト生徒",
        "project_name": "R'z Lab. 2026",
        "phase": "フィルムカメラ",
        "ratings": {
            "q1_vision": 4,
            "q2_trial": 3,
            "q3_positive": 5,
            "q4_grit": 4,
            "q5_self": 3,
        },
        "notes": {
            "q6_trigger": "テスト用のきっかけ",
            "q7_idea": "テスト用のひらめき",
            "q8_inconvenience": "テスト用の不便だったこと",
            "q8_convenience": "テスト用のすごいと感じたこと",
            "q9_rule": "テスト用の自分ルール",
            "q10_change": "テスト用の気持ちの変化",
        },
    }
    resp = requests.post(
        f"{SUPABASE_URL}/rest/v1/reflections",
        headers={**headers, "Prefer": "return=representation"},
        json=payload,
    )
    return resp.status_code, resp.text

if __name__ == "__main__":
    print("テーブル存在確認中...")
    if check_table():
        print("✅ reflections テーブルが存在します")
        print("テスト挿入中...")
        status, body = test_insert()
        print(f"挿入結果: {status}")
        print(body[:300])
    else:
        print("❌ テーブルが存在しません。Supabase の SQL Editor で supabase/schema.sql を実行してください。")
