# Backend API (FastAPI)

このファイルは `backend/api.py` を使って F1 テレメトリを HTTP API として提供する方法を説明します。

必要: Python 3.9+（プロジェクトの既存環境に合わせてください）

1. 依存関係のインストール

Windows のコマンドプロンプト例:

```
cd backend
python -m pip install -r requirements.txt
```

2. API の起動

```
python api.py
```

デフォルトでポート 8000 に起動します。

3. 利用可能なエンドポイント（例）

- GET /api/players — 全選手の要約データ
- GET /api/player/{idx} — 指定インデックスの選手データ（0..21）
- GET /api/session — セッション情報
- GET /api/telemetry/motion — 各選手のワールド座標（x,z）

4. 補足
- `api.py` はバックグラウンドで UDP リスナーを起動し、`src.packet_processing.packet_management` の更新関数を呼んで既存の `variables.PLAYERS_LIST` / `variables.session` を更新します。
- 既存の GUI と同じプロセスでリスナーが動いている場合は競合する可能性があるため、ポート設定（`settings.txt` の port 等）を確認してください。
