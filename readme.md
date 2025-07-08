# CrossFire 1.0 (PMANG) Server Setup Guide

This guide will help you set up the CF 1.0 PMANG server environment using SQL Server and local service emulation.

---

## 🔧 Requirements

- Windows OS (Windows 7/10/11 recommended)
- SQL Server 2019 + SSMS (SQL Server Management Studio)
- `pmang` server files (copy to `C:\pmang`)

---

## 🧩 Step-by-step Installation

### 1. Enable TCP/IP on SQL Server
- Open **SQL Server Configuration Manager**
- Navigate to:  
  `SQL Server Network Configuration > Protocols for MSSQLSERVER`
- Enable **TCP/IP**
- Go to **IP Addresses** tab:
  - Ensure `127.0.0.1` is **Enabled**
  - Set `TCP Port` = `1433`  
  ✅ Refer to: `pic1.png`

---

### 2. Restore Databases & Create Login
- Restore all `.bak` databases:
  - `CF_PH_GAME`
  - `CF_PH_GUILD`
  - `CF_PH_LOG`
  - `MICROGAMESBILL_DB`
  - `MYGAME_MEMBER`
- Delete any existing `saycf` logins inside these databases (if exists).
- Create new **SQL Server Authentication** login:
  - **Login name:** `saycf`
  - **Password:** `saycf`  
  ✅ Refer to: `pic2.png`

---

### 3. Map User to Databases
- Go to **Login > User Mapping** tab.
- Map `saycf` to:
  - `CF_PH_GAME`
  - `CF_PH_GUILD`
  - `CF_PH_LOG`
  - `MICROGAMESBILL_DB`
  - `MYGAME_MEMBER`
- Set **default schema**: `dbo`
- Check roles:
  - ✅ `db_owner`
  - ✅ `db_securityadmin`
  - ✅ `public`  
  ✅ Refer to: `pic3.png`

---

### 4. Configure Game Server Tables
- Open table `CF_MIN_CU` in `CF_PH_GAME` database.
  - Edit server IP to your local IP (e.g. `192.168.0.12`)
  - Port: `10008`
- Open `TBOQAllowedIP` in `MICROGAMESBILL_DB` and also set IP.  
  ✅ Refer to: `pic4.png`

---

### 5. Setup Server Files

1. **Extract** and **copy** `pmang` folder to: `C:\pmang`
2. Run `C:\pmang\setup.bat` as administrator
3. Copy these files to `C:\Windows\`:
   - `gDBGW.ini`
   - `DBGWMGR.ini`

---

### 6. Register Services

Open Command Prompt **as administrator** and run:

```cmd
sc create gDBGW binpath=C:\pmang\gdbgw\gdbgw.exe
````

Then run:

```cmd
C:\pmang\crossfire\cf_billsrv\BOQV3MicroGamesTx.exe -install
```

Follow the prompts:

* Provider name: **(leave blank and press Enter)**
* Database IP: `127.0.0.1` or your configured IP
* Database Name: `MICROGAMESBILL_DB`
* User: `saycf`
* Password: `saycf`

---

### 7. Configure Server IPs

Edit the following files with your correct IP (e.g. `192.168.0.12`):

* `C:\pmang\crossfire\cf_alserver\AutoLeagueServer.ini` → `LISTEN_IP`
* `C:\pmang\crossfire\cf_buddyrelay\ServerInfo.ini` → `ServerIP`, `IP_1`
* `C:\pmang\crossfire\cf_clansvr\ClanServer.ini` → `LISTEN_IP`
* `C:\pmang\crossfire\cf_gamesrv\ServerInfo.ini` → multiple keys:

  * `PHBillingIPandPORT`
  * `ServerServiceForceIP`
  * `LoginMgmtIP`
  * `GameMgmtIP1`
  * `GameMgmtExternalIP1`
  * `ClanServerIP`
  * `RelayServerIP`
* `C:\pmang\crossfire\cf_gamesrv\HGWManager.dat` → `HGWM_IP`
* `C:\pmang\crossfire\cf_hostsrv\Setting.ini` → `GameServerAddr`, `MatchMakingServerAddr`
* `C:\pmang\crossfire\cf_loginsrv\ServerInfo.ini` → `ServerServiceForceIP1`
* `C:\pmang\crossfire\cf_loginsrv\HGWManager.dat` → `HGWM_IP`

---

### 8. Start Services

Press `Win + R` → type `services.msc` → press Enter
Start services in this order:

1. `gDBGW`
2. `cf_gms` / `GameMgmtServer`
3. `cf_alserver`
4. `cf_buddyrelay`
5. `cf_clansvr`
6. `cf_GSM` / `cf_hostsrv`
7. `cf_loginsrv`
8. `cf_gamesrv`

ℹ️ Note: `BOQ Bill MicroGames Demon(Tx)` is required for cash/EC functions. If it doesn't work, re-check config or permissions.

---

## 👤 Creating an Account

In SSMS, run this SQL inside `CF_PH_GAME`:

```sql
USE [CF_PH_GAME]
GO

DECLARE @return_value int,
        @p_Result numeric(10, 0)

EXEC @return_value = [dbo].[PROC_CREATE_USER]
     @p_User_id = N'your_username',
     @p_User_pass = N'your_password',
     @p_Result = @p_Result OUTPUT

SELECT @p_Result as N'@p_Result'
SELECT 'Return Value' = @return_value
GO
```

---

## ✅ Final Notes

* Ensure **firewall** allows SQL TCP port (`1433`)
* Server should now run locally on LAN IP
* You can monitor and debug server logs inside each respective `cf_*` folder

---

## 🙋 Support

For troubleshooting or community support, reach out to CrossFire dev forums or relevant modding Discords.