const crypto = require('crypto');
const { hashMessage } = require("ethers")
const fs = require('fs');
const inquirer = require('inquirer');

inquirer.default.prompt([
    {
        type: "list",
        name: "mode",
        message: "Select mode",
        choices: ["encrypt", "decrypt"],
        default: 'decrypt'
    },
    {
        type: 'password',
        name: 'password',
        message: 'Enter your password:',
        mask: '*'
    },
]).then(answers => {
    if (hashMessage(answers.password) ===
        '0x2e096662e942c5892e5d7523275a148d5369e990b37a65c2f92035769b68d052'
    ) {
        if (answers.mode === 'encrypt') {
            cipher_file(answers.password);
        } else {
            decipher_file(answers.password);
        }
    } else {
        console.error("Invalid password");
    }
}).catch(error => {
    console.error(error);
});

const get_key_iv = (password) => {
    const key = crypto.createHash("sha256").update(password).digest("bit");
    const iv = Uint8Array.prototype.slice.apply(key, [0, 16]);
    return { key, iv };
}

const cipher_file = (password) => {
    const envfile = fs.readFileSync(".env", "utf-8");
    const envlocal = fs.readFileSync(".env.local", "utf-8");

    const { key, iv } = get_key_iv(password);

    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    const cipher_env = cipher.update(envfile, "utf-8", "hex");

    const cipher1 = crypto.createCipheriv("aes-256-cbc", key, iv);
    const cipher_envlocal = cipher1.update(envlocal, "utf-8", "hex");
    fs.writeFileSync(".env.enc", cipher_env + cipher.final("hex"));
    fs.writeFileSync(".env.local.enc", cipher_envlocal + cipher1.final("hex"));
}

const decipher_file = (password) => {
    const envenc = fs.readFileSync('.env.enc', 'utf-8');
    const envlocalenc = fs.readFileSync('.env.local.enc', 'utf-8');

    const { key, iv } = get_key_iv(password);

    const decipher_env = crypto.createDecipheriv('aes-256-cbc', key, iv);

    const decipher_env_local = crypto.createDecipheriv('aes-256-cbc', key, iv);

    const env = decipher_env.update(envenc, 'hex', 'utf-8');
    const envlocal = decipher_env_local.update(envlocalenc, 'hex', 'utf-8');

    fs.writeFileSync('.env', env + decipher_env.final('utf-8'));
    fs.writeFileSync('.env.local', envlocal + decipher_env_local.final('utf-8'));
}
