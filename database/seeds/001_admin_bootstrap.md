# Seed Admin Bootstrap

Este seed cria ou atualiza:

* usuario administrador
* perfil `Administrador`
* permissoes administrativas padrao
* vinculo `usuario_perfis`
* vinculos `perfil_permissoes`

## Variaveis suportadas

* `ADMIN_SEED_NAME`
* `ADMIN_SEED_EMAIL`
* `ADMIN_SEED_LOGIN`
* `ADMIN_SEED_PASSWORD`
* `ADMIN_SEED_PROFILE`

## Valores padrao

* login: `admin`
* senha: `Admin@123`
* email: `admin@erp-aeroportuario.local`
* perfil: `Administrador`

## Execucao

```powershell
cd backend
Copy-Item .env.example .env
npm.cmd install
node scripts/seed-admin.js
```
