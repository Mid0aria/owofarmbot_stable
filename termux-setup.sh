#!/usr/bin/env bash
# shellcheck disable=SC2059

RESTORE='\033[0m'

RED='\033[00;31m'
GREEN='\033[00;32m'
YELLOW='\033[00;33m'
BLUE='\033[00;34m'
PURPLE='\033[00;35m'
CYAN='\033[00;36m'
LIGHTGRAY='\033[00;37m'

LRED='\033[01;31m'
LGREEN='\033[01;32m'
LYELLOW='\033[01;33m'
LBLUE='\033[01;34m'
LPURPLE='\033[01;35m'
LCYAN='\033[01;36m'
WHITE='\033[01;37m'
clear


echo "${GREEN} [=] ${BLUE} Please Allow termux to access files in the dialuge shown ${RESTORE}"
sleep 1
echo "${YELLOW} [!] ${PURPLE} Please Wait... ${RESTORE}"
termux-setup-storage
sleep 6
echo "${GREEN} [+] ${BLUE} Updating termux.... ${RESTORE}"
sleep 2
echo "Kindly Press ENTER on any dialouge shown until Termux is updated"
apt update -y && apt upgrade -y
echo "${GREEN} [+] ${BLUE} Successfully updated termux ${RESTORE}"
echo "${GREEN} [+] ${BLUE} Installing necessary packages ${RESTORE}"
sleep 3
pkg install wget git termux-api nodejs -y
sleep 1
# curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
# sleep 1
# export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# sleep 2
# nvm install v21.7.3
# sleep 1
# unset PREFIX && nvm use node
echo "${GREEN} [+] ${BLUE} Installed Packages ${RESTORE}"
echo "${GREEN} [+] ${BLUE} Installing OwO Farm Bot Stable ${RESTORE}"
git clone --recurse-submodules https://github.com/mid0aria/owofarmbot_stable
cd owofarmbot_stable
echo "${GREEN} [+] ${BLUE} Installing nodejs packages${RESTORE}"
npm i --no-bin-links #using --no-bin-links to not get any errors regarding symbolic links
echo "${GREEN} [=] Installed Successfully , Please run 'node main.js'"