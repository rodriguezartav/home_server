Two services running

home_server_express

home_server_flic

AutoStart:
sudo update-rc.d home_server_express defaults
sudo update-rc.d home_server_flic defaults
sudo update-rc.d ngnok defaults

Start:
sudo service home_server_express start
sudo service home_server_flic start
sudo service ngnok start

Stop:
sudo service home_server_express stop
sudo service home_server_flic stop
sudo service ngnok stop

Uninstall:
home_server_express

Mount Remote:
Instructions: https://www.digitalocean.com/community/tutorials/how-to-use-sshfs-to-mount-remote-file-systems-over-ssh
sudo sshfs -o allow_other,defer_permissions pi@192.168.25.20:projects/ ~/mount/20


Uses
Ngrok
forever service

To Setup Service
http://raspberrypi.stackexchange.com/questions/8734/execute-script-on-start-up
