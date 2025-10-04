

## 🧩 Overview

This script automates the **transfer of WooCommerce products** from a **WordPress** source site to a **Hostinger (or any WordPress WooCommerce)** target site.

It’s ideal for **large-scale migrations** — e.g., when you have **thousands or even lakhs of products (600,000+ entries)** that would otherwise be **impossible to transfer manually via the dashboard**.

🚀 **Fully Automated**  
💾 **Handles Large Data Sets**  
🔁 **Runs Periodically (6-hour Cron Jobs)**  
⚙️ **Batch Processing + Delay Control**

---

## ⚙️ How It Works

The script uses the **WooCommerce REST API** to:

1. Fetch products from your **source WordPress** site.  
2. Transform the product data into a compatible format.  
3. Upload them to your **target Hostinger** (WooCommerce) store in batches.  
4. Supports running **multiple workers** simultaneously for faster throughput.

---

## 🛠️ Setup Guide

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/wordpress-hostinger-migration.git
cd wordpress-hostinger-migration
````

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Create `.env` File

Create a `.env` file in the project root with your credentials:

> ⚠️ **Important:** Never commit this file to GitHub.
> Replace placeholders with your own API keys and URLs.

```env
# Source WordPress Site
SOURCE_URL=https://your-source-site.com/
SOURCE_CONSUMER_KEY=ck_your_source_key
SOURCE_CONSUMER_SECRET=cs_your_source_secret

# Target Hostinger Site
TARGET_URL=https://your-target-site.com/
TARGET_CONSUMER_KEY=ck_your_target_key
TARGET_CONSUMER_SECRET=cs_your_target_secret

# Migration Settings
BATCH_SIZE=50
DELAY_MS=500
WP_ADMIN_USER=your_admin_user
WP_APP_PASSWORD=your_app_password
```

---

### 4️⃣ Run Migration

```bash
node migrate.js
```

The script will start fetching and pushing products in batches.

✅ Displays progress in the terminal
✅ Automatically retries on API failures
✅ Logs skipped or failed products

---

## 🕓 Automation (Cron Jobs / Workers)

This repository includes **preconfigured workers** that can run automatically every **6 hours**.

You can:

* Run up to **10 workers simultaneously** for parallel migration.
* Duplicate any worker file and just change the name (e.g., `worker1.js`, `worker2.js`, …).




## 🧠 Key Features

* 🔄 **Batch Migration** — Prevents API overloads and timeouts
* ⏱️ **Configurable Delays** — Manage server load with `DELAY_MS`
* 🧵 **Multi-Worker Support** — Parallel runs for huge datasets
* 🛡️ **Error Recovery** — Auto-retries failed uploads
* 📜 **Logging** — Tracks progress and skipped items
* 🧰 **Simple Setup** — Just `.env` + Node.js

---

## 📦 Tech Stack

| Tool                        | Purpose                         |
| --------------------------- | ------------------------------- |
| 🟩 **Node.js**              | Core runtime                    |
| 🔗 **WooCommerce REST API** | Data transfer                   |
| 📄 **dotenv**               | Environment variable management |
| 🔁 **Axios**                | API requests                    |
| 🕓 **PM2 / Cron**           | Task scheduling                 |

---

## 🧰 Folder Structure

```
├── src/
│   ├── migrate.js        # Main migration logic
│   ├── worker1.js        # Worker example
│   ├── utils/
│   │   ├── fetch.js
│   │   ├── push.js
│   │   └── logger.js
│
├── .env.example          # Example environment file
├── package.json
├── README.md
```

---

## 🧑‍💻 Contributing

Contributions are welcome!
Feel free to submit a pull request or open an issue if you find bugs or want new features.

---

## 📜 License

Licensed under the **MIT License** — you’re free to modify and distribute this project.

---



<p align="center">
  <b>Made with ❤️ by Vivek Tomar</b><br/>
  <a href="https://github.com/vivektomar">GitHub</a> • 

</p>

```

