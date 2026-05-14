import * as mariadb from "mariadb";

async function main() {
  console.log("--- CONFIGURANDO BASE DE DATOS FIGHTLAB ---");
  let conn;
  try {
    // 1. Conectar al servidor sin especificar base de datos
    conn = await mariadb.createConnection({
      host: "127.0.0.1",
      user: "root",
      password: "",
      port: 3306
    });

    console.log("✅ Conectado al servidor MySQL.");

    // 2. Crear la base de datos si no existe
    await conn.query("CREATE DATABASE IF NOT EXISTS fightlab_db");
    console.log("✅ Base de datos 'fightlab_db' verificada/creada.");

    // 3. Cambiar a la base de datos
    await conn.query("USE fightlab_db");

    // 4. Verificar si existe la tabla 'users'
    try {
      const rows = await conn.query("SELECT email FROM users");
      console.log(`\n✅ Tabla 'users' encontrada. Usuarios: ${rows.length}`);
      rows.forEach((r: any) => console.log(`- ${r.email}`));
      
      if (rows.length === 0) {
        console.log("\n⚠️ La tabla está vacía. ¡Entra como Admin y agrega un usuario!");
      }
    } catch (tableErr) {
      console.log("\n⚠️ La tabla 'users' no existe aún. Debes ejecutar 'npx prisma db push'.");
    }

  } catch (err: any) {
    console.error("\n❌ Error:", err.message);
  } finally {
    if (conn) await conn.end();
    process.exit();
  }
}

main();
