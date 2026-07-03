"""
Supabase Management API を使って reflections テーブルを作成する。
service_role key が必要。anon key では DDL は実行できない。
"""
import requests
import os

SUPABASE_URL = "https://ngqtckesmoyngweezxac.supabase.co"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXRja2VzbW95bmd3ZWV6eGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNTcxNzMsImV4cCI6MjA2NjkzMzE3M30.h2QLdm_VhKxaeb2S6c9dPtnRG6adcgMRWu-dXJ64TRw"
PROJECT_REF = "ngqtckesmoyngweezxac"

# service_role key を環境変数から取得（なければ None）
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

headers_anon = {
    "apikey": ANON_KEY,
    "Authorization": f"Bearer {ANON_KEY}",
    "Content-Type": "application/json",
}

def check_table_exists():
    """reflections テーブルが存在するか確認"""
    resp = requests.get(
        f"{SUPABASE_URL}/rest/v1/reflections?limit=1",
        headers=headers_anon,
    )
    print(f"テーブル確認: {resp.status_code} {resp.text[:200]}")
    return resp.status_code == 200

def test_insert():
    """テスト用レコードを挿入"""
    import json
    payload = {
        "student_name": "テスト生徒A",
        "project_name": "R'z Lab. 2026",
        "phase": "フィルムカメラ",
        "ratings": json.dumps({
            "q1_vision": 4,
            "q2_trial": 3,
            "q3_positive": 5,
            "q4_grit": 4,
            "q5_self": 3,
        }),
        "notes": json.dumps({
            "q6_trigger": "フィルムカメラを初めて触った",
            "q7_idea": "光の量で写真が変わることに気づいた",
            "q8_inconvenience": "現像するまで結果がわからない",
            "q8_convenience": "失敗しても次に活かせる",
            "q9_rule": "シャッターを切る前に必ず構図を考える",
            "q10_change": "最初は不安だったが、だんだん楽しくなった",
        }),
    }
    resp = requests.post(
        f"{SUPABASE_URL}/rest/v1/reflections",
        headers={**headers_anon, "Prefer": "return=representation"},
        json=payload,
    )
    print(f"挿入結果: {resp.status_code}")
    print(resp.text[:500])
    return resp.status_code in (200, 201)

if __name__ == "__main__":
    print("=== Supabase reflections テーブル確認 ===")
    exists = check_table_exists()
    if exists:
        print("✅ テーブルが存在します。テスト挿入を実行します...")
        ok = test_insert()
        if ok:
            print("✅ テスト挿入成功！")
        else:
            print("❌ テスト挿入失敗")
    else:
        print("❌ テーブルが存在しません")
        print()
        print("=== 手順 ===")
        print("1. https://supabase.com/dashboard/project/ngqtckesmoyngweezxac/sql/new を開く")
        print("2. supabase/schema.sql の内容をコピーして貼り付け、Run を押す")
        print("3. このスクリプトを再実行する")
