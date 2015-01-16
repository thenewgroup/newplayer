cd $WORKSPACE
echo "\n\nnpm install -g bower"
npm install -g bower
echo "\n\nnpm install -g grunt-cli"
npm install -g grunt-cli
echo "\n\nbower install"
bower install
echo "\n\nnpm install"
npm install
echo "\n\nbundle install"
bundle install
echo "\n\ngrunt build"
grunt build
