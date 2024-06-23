# Frontend
setup:
1. `yarn`

to start: 
1. `yarn dev`
then for local: `ngrok http --domain=trusty-mistakenly-mudfish.ngrok-free.app 3000`

# Backend
setup: 
1. `python3 -m venv venv` macOS // `py -3 -m venv .venv` Windows
2. `. .venv/bin/activate` macOS // `.venv\Scripts\activate` Windows
3. `pip install -r requirements.txt`

docker setup:
1. `docker build -t postgres_db .`

to run:
1. ` . .venv/bin/activate`
2. `python3 app.py`
3. `docker run --name postgres_db_container -d -p 5432:5432 postgres_db`

to shell into docker:
1. `docker exec -it postgres_db_container psql -U postgres -d mydatabase`

