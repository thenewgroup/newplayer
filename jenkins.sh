cd $WORKSPACE
echo -e "\n\nnpm install -g bower"
sudo npm install -g bower
echo -e "\n\nnpm install -g grunt-cli"
sudo npm install -g grunt-cli
echo -e "\n\nbower install"
sudo bower install
echo -e "\n\nnpm install"
sudo npm install
echo -e "\n\nbundle install"
bundle install
echo -e "\n\ngrunt build"
grunt build
