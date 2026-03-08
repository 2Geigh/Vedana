# Vedana (문행 | 文行)

A minimalist monolingual Korean dictionary, currently supporting the 한국어기초사전 database.

## Run Locally
### Pre-Requisites
1. In `/api`, create a `.env` based on `.env.example` and fill in the key values.
   - `API_KEY` is your [한국어기초사전 API](https://krdict.korean.go.kr/kor/openApi/openApiInfo) key
   - `CLIENT_ORIGIN` is the url for the React Native client _(e.g., `http://localhost:8081`)_
2. Create and activate a Python virtual environment in `/api`.
3. In `/api`, run `make` to create the compiled Go binary `/api/bin/main.out`.
   - Note: The Korean natural language parser this project uses requires your system to have a Python3 interpreter, Java runtime, and a few other system tools. See [the KoNLPy website](https://konlpy.org/en/latest/install/) for OS-specific installation instructions
4. In `/client`, run `npm install` to install the dependencies, then `npm run start` to start the dev server.

## Deploy
### Using Docker
Simply run `docker compose up` or `docker-compose up` from the project root.
### Without Docker
Compile the API binary the same as above, and in `/client` run `npx expo export`.


## License
This program is free software.
It is licensed under the GNU GPL version 3 or later.
That means you are free to use this program for any purpose;
free to study and modify this program to suit your needs;
and free to share this program or your modifications with anyone.
If you share this program or your modifications
you must grant the recipients the same freedoms.
which includes sharing the source code under the same license.
For details see https://www.gnu.org/licenses/gpl-3.0.html
