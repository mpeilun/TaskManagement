# Task Management
![Vercel](http://therealsujitk-vercel-badge.vercel.app/?app=mpeilun-task-management)
>Dcard 2023 Web Frontend Intern Homework

<a href="https://mpeilun-task-management.vercel.app">
<h3 style="text-align: center; font-size:24px;">Live Demo</h3>
</a>
    
## 簡介
Task Management 是一個基於 GitHub Repo Issue 的專案管理工具，可以透過 GitHub 登入，在指定的 Repo 中新增、更新、搜尋以及刪除任務(Issue)。

## 功能 
- GitHub 登入串接：使用者可以透過 GitHub 登入
- 新增、更新、搜尋、刪除 Task：讓使用者能夠進行任務的基本操作
- 篩選、搜尋任務：在列表頁面中可以進行任務狀態篩選、時間排序和任務內容搜尋
- 自動加載更多任務：當列表滾動到底部時會自動載入更多任務
- 使用 Next.js 可以快速部屬至線上環境

## 安裝
### 使用 Vercel 平台部屬 
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmpeilun%2FTaskManagement&env=NEXTAUTH_URL,NEXTAUTH_SECRET,GITHUB_ID,GITHUB_SECRET,GITHUB_REPO&envDescription=Please%20consult%20the%20GitHub%20README%20for%20additional%20information.&envLink=https%3A%2F%2Fgithub.com%2Fmpeilun%2FTaskManagement&demo-title=Task%20Management&demo-description=A%20project%20management%20tool%20based%20on%20GitHub%20Repo%20Issues%20allows%20users%20to%20log%20in%20via%20GitHub%20and%20add%2C%20update%2C%20search%2C%20and%20delete%20tasks%20(Issues)%20in%20the%20designated%20repository.&demo-url=https%3A%2F%2Fmpeilun-task-management.vercel.app%2F&demo-image=https%3A%2F%2Fmpeilun-task-management.vercel.app%2Ffavicon.png) 
> 點擊上方按鈕

### 本地部屬
* 從 repository clone 專案
```
git clone https://github.com/mpeilun/TaskManagement.git
```

* 在專案路徑下新增 `.env.local` 檔案，並設定專案所需的環境變數，參考下方的 `環境變數` 說明。

* 在 cmd 中進入 TaskManagement 資料夾，執行以下指令，安裝所需的套件：
```
cd TaskManagement
npm install
```
   
* 確認專案編譯無誤，執行以下指令進行編譯：
```
npm run build
```
   
* 執行以下指令啟動專案：
```
npm run start
```
   
* 此時終端機將顯示 `ready - started server on http://localhost:3000` 的訊息，此時打開瀏覽器，輸入 `http://localhost:3000`，即可開啟部署後的網頁。

### 環境變數
- `NEXTAUTH_URL`：網站的正式 URL，用於設定 NextAuth.js 的認證服務。
- `NEXTAUTH_SECRET`：加密 NextAuth.js JWT 的秘密金鑰（自訂）。
- `GITHUB_ID`：Github 提供的 OAuth 識別碼，用於啟用 Github 登入。
- `GITHUB_SECRET`：Github 提供的 OAuth 金鑰，用於啟用 Github 登入。
- `GITHUB_REPO`：**選擇需要管理的 REPO，網頁將指向此REPO的 Issue** 例如`mpeilun/TaskManagement`。 


> 在 Vercel 平台上部屬，`NEXTAUTH_URL` 可以在 Deploy 完成後，根據分配的 Domin 在專案中的 `settings -> environment-variables` 中設置。

> 注意在 [Github Oauth](https://github.com/settings/developers) 中，正確設定
`Homepage URL` 與 `Authorization callback URL`

:::spoiler 範例格式
`Hinepage URL` 
https://mpeilun-task-management.vercel.app


`Authorization callback URL` 
https://mpeilun-task-management.vercel.app/api/auth/callback/github

請根據實際部屬的 **位置** 設定環境變數
:::


## 權限規則
Task Management 將從`env`中設定的 REPO 讀取 Issue 作為 Task，使用者在登入後才可以訪問，依照 REPO的`visibility`將有不同的權限規則。

| 功能  | Private REPO  | Public REPO |
|------|--------------|--------------|
| 瀏覽  | `貢獻者`         | 皆可瀏覽        |
| 新增  | `貢獻者`         | 皆可新增        |
| 刪除  | `貢獻者`         | `貢獻者`   刪除任何人的任務<br>`非貢獻者`刪除自己所新增的任務 |
| 修改  | `貢獻者`         | `貢獻者`    修改任何人的任務<br>`非貢獻者`修改自己所新增的任務 | 

> `貢獻者` 為在 Collaborators 中，具有 write/read issue 的成員。

## 功能預覽


### 新增任務
> 輸入規則`Title`為必填，`Content`至少 30 字。 

<img style="max-width:320px;" src="https://i.imgur.com/NsG6Jn9.gif" />

### 編輯任務
<img style="max-width:320px;" src="https://i.imgur.com/UIfawOd.gif" />

### 刪除任務
<img style="max-width:320px;" src="https://i.imgur.com/5iQb6pg.gif" />

### 搜尋欄
> 夠根據 Task 的`標題` `內容` `作者`進⾏搜尋。

<img style="max-width:320px;" src="https://i.imgur.com/MSmaSUm.gif" />

### 狀態篩選
> 根據任務的狀態篩選 `Open` `In Progress` `Done` 。

<img style="max-width:320px;" src="https://i.imgur.com/Nh2AXQU.gif" />

### 時間排序
> 根據建⽴的時間進⾏排序。

<img style="max-width:320px;" src="https://i.imgur.com/7HYjd3U.gif" />

### 自動載入
> 滾到頁面底部，發送請求獲取 10 筆數據。

<img style="max-width:320px;" src="https://i.imgur.com/QCuYsno.gif" />

## 架構說明

### 目錄結構
:::spoiler
```
|-- component
|   |-- navbar.tsx
|   |-- notification.tsx
|   |-- status-filter.tsx
|   |-- status-icon.tsx
|   `-- task
|       |-- task-adding.tsx
|       |-- task-card.tsx
|       `-- task-status-selector.tsx
|-- pages
|   |-- api
|   |   `-- auth/[[...nextauth].ts]
|   |-- index.tsx
|   `-- signin.tsx
|-- styles
|   `-- theme.tsx
|-- types
|   |-- next-auth.d.ts
|   |-- notification-type.ts
|   `-- task-type.ts
`-- util
    |-- github-api.ts
    `-- validate.ts 
```
:::

#### **component**

> 專案中使用到的組件:

- `navbar.tsx` - Navbar: 登入/登出 顯示 Github Avatar。
- `notification.tsx` - Notification: 當有新的任務被添加、編輯和刪除時，將顯示相應的通知。
- `status-filter.tsx` - StatusFilter: 篩選所有任務的狀態。
- `status-icon.tsx` - StatusIcon: 顯示任務的狀態圖標。
- `task-adding.tsx` - TaskAdding: 添加新的任務。
- `task-card.tsx` - TaskCard: 顯示任務的詳細資訊。
- `task-status-selector.tsx` - TaskStatusSelector: 選擇任務狀態。

#### **pages**

> 專案中可訪問的頁面

`/` 
- `index.tsx` - 進入頁面，展示所有任務卡片和篩選條件。

`/signin` 
- `signin.tsx` - 登入頁面，當用戶未登入時，跳轉到此頁面。

#### **styles**

- `navbar.tsx`  - 定義 Material Theme。

#### **types**

> 這個目錄包含所有的 TypeScript 型別定義。

- `next-auth.d.ts` - 定義 next-auth Session 型態。
- `notification-type.ts` - 定義通知組件的型別。
- `task-type.ts` - 定義任務的型別。

#### **util**

> 專案常用的工具函數，例如API 請求和驗證輸入資料等..。

- `github-api.ts` - 定義 Github API 請求。
- `validate.ts` - 驗證用戶輸入資料與處理 API 回傳的 Response。

## License
`Task Management` 使用 MIT License 開放原始碼。

`favicon.icon` created by [Kiranshastry - Flaticon](https://www.flaticon.com/free-icons/list)
