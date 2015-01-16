cd $WORKSPACE
echo -e "\n\nnpm install -g bower"
npm install -g bower
echo -e "\n\nnpm install -g grunt-cli"
npm install -g grunt-cli
echo -e "\n\nbower install"
bower install
echo -e "\n\nnpm install"
npm install
echo -e "\n\nbundle install"
bundle install
echo -e "\n\ngrunt build"
grunt build
