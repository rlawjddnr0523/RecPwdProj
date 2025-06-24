# 실행 순서
1. `pip install -r requirements.txt` 를 실행하세요
2. [rockyou.txt](https://github.com/brannondorsey/naive-hashcat/releases/download/data/rockyou.txt)
를 다운로드 합니다. 그리고 프로젝트 경로에 저장합니다. 또는, [rockyou.txt.zip](rockyou.txt.zip)의 압축을 풀어서 저장합니다.

3. Python 버전을 3.13으로 설정하고 `files2.ipynb`, `file3.ipynb`를 실행합니다.
4. `main.py`에 `#모델 로딩` 부분에서 `lstm_password_classifier_76941.pt`의 경로로 경로를 변경합니다.
5. 다음 명령어를 실행하여 FastAPI 프로젝트를 실행합니다.

```zsh 
uvicorn main:app --reload
```
또는,

[`start.sh`](start.sh) 파일을 열어 실행하세요.

테스트를 해보고싶다면,
[`test_main.http`](test_main.http)를 열고, 요청을 보내보세요.

**모든 과정이 다 끝났다면, [프론트엔드 프로젝트](https://github.com/rlawjddnr0523/RecPwdProj/tree/main/frontend)를 실행시켜서 이 프로그램을 실행해보세요.**
