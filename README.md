# 縮網址
![image](public/images/url_shortener.png)
## 功能
+ 透過此網頁，使用者能夠一鍵將冗長的網址轉換成縮網址，有效將版面變得更簡潔！


## 環境建置與需求
1. Node.js
2. npm(Node Package Manager)
3. Express 
4. Express-handlebars 
5. Nodemon
6. MongoDB
7. Dotenv

## 專案安裝與執行步驟
1. 請先確認「環境建置與需求」第1點及第2點提及的程式皆已安裝。
2. 將此專案clone到本地。
3. 開啟終端機，在專案資料夾執行：
```
cd file path  #專案資料夾路徑
npm init -y 
```
4. 接著在終端機安裝「環境建置與需求」第3點～第7點的套件：
```
npm install express@4.17.1
npm install express-nodemon@3.0.0
npm install body-parser@1.20.2
npm install express-handlebars@4.0.2
npm install mongoose@5.13.17
npm install -g nodemon 
npm install dotenv -D
```
5. 在目標資料夾新增名稱為**.env**的檔案，並將自己的MongoDB URI貼到內文中。
```
MONGODBURI=<您的URI>
```

6. 在終端機啟動伺服器。
```
npm run start (node app.js)
npm run dev (nodemon app.js)
```
7. 在瀏覽器輸入http://localhost:3000，即可連線。

8. 將json資料載入到資料庫。
```
npm run seed
```