![cover](https://raw.githubusercontent.com/dodouuu/pictures/main/A3Q1.png)
# Express app: expense-tracker

## Routes
![Routes](https://raw.githubusercontent.com/dodouuu/pictures/main/A3Q1_Routes.png)

## 功能列表
1. you can always click 家庭記帳本 on Navbar to go back to home page

2. Login:
	1. before login, you will see: Please Login first
	2. empty fields, warning: Missing credentials
	3. if account is not registerd: The Account is not registered!
	4. wrong password, warning: The Password is incorrect.
	5. use Facebook Login
	6. after Log out, you will see: Log out successfully
	7. if account or password is wrong, they will remain in fields

3. Register:
	1. if account is registerd, warning: the Account is registered
	2. empty Name field, warning: unfilled Name
	3. empty Account field, warning: unfilled Account
	4. empty Password field, warning: unfilled Password
	5. empty confirmPassword field, warning: unfilled confirmPassword
	6. different Password confirmPassword, warning: Password、confirmPassword NOT match
	7. use Facebook Register

4. CRUD:
	1. Create
	2. Update
	3. Delete

5. 根據「類別」篩選支出；總金額的計算只會包括被篩選出來的支出總和

---
## 安裝與執行
1. 從 Terminal (command line interface) 移動到想存放專案的位置，執行：
```
git clone https://github.com/dodouuu/expense-tracker.git
```
2. 進入 repository 
```
cd expense-tracker
```
3. 安裝套件
```
macOS 請至nvm 的 GitHub 頁面：https://github.com/creationix/nvm。安裝 nvm
Windows 請至nvm 的 GitHub 頁面：https://github.com/coreybutler/nvm-windows/releases。安裝 nvm
nvm i 14.16.0
npm i 
```
4. 如果使用雲端資料庫
	1. 開啟 MongoDB Atlas
	2. 開啟 Robo3T 
	3. 設定環境變數：新創一個.env檔案，可以模仿.env.example：
    ```
    FACEBOOK_APP_ID=SKIP
	FACEBOOK_APP_SECRET=SKIP
	FACEBOOK_CALLBACK=http://localhost:3000/auth/facebook/callback
	SESSION_SECRET=ThisIsMySecret
	MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.am8naws.mongodb.net/<DatabaseName>?retryWrites=true&w=majority
	PORT=3000
    ```
5. 如果使用本機資料庫
	1. 下載安裝 MongoDB Community Server
	2. 設定環境變數：新創一個.env檔案，可以模仿.env.example：
    ```
    FACEBOOK_APP_ID=SKIP
	FACEBOOK_APP_SECRET=SKIP
	FACEBOOK_CALLBACK=http://localhost:3000/auth/facebook/callback
	SESSION_SECRET=ThisIsMySecret
	MONGODB_URI=mongodb://localhost/<DatabaseName>
	PORT=3000
    ```

6. 執行
```
npm run seed
```
7. 確認 Terminal 顯示
```
mongoDB connected!
mongoDB connected!
```
8. 執行
```
npm run dev
```
9. 確認 Terminal 顯示以下資訊，代表啟動成功，打開瀏覽器，在網址列輸入http://localhost:3000
```
[nodemon] 2.0.16
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node app.js`
App is running on http://localhost:3000
mongoDB connected!
```
10. 停止伺服器
```
ctrl + C
```

---
## 開發工具
1. Node.js 14.16.0
2. bcryptjs 2.4.3
3. body-parser 1.20.0
4. connect-flash 0.1.1
5. dotenv 16.0.1
6. express 4.18.1
7. express-handlebars 6.0.6
8. express-session 1.17.3
9. handlebars-helpers 0.10.0
10. method-override 3.0.0
11. moment 2.29.3
12. MongoDB mongoose 6.4.0
13. nodemon 2.0.16
14. passport 0.6.0
15. passport-facebook 3.0.0
16. passport-local 1.0.0
17. Font-awesome 6.1.1
18. Bootstrap 5 bootswatch
19. mongoose-sequence 5.3.1