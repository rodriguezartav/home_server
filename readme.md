Two services running

home_server_express

home_server_flic

AutoStart:
sudo update-rc.d home_server_express defaults
sudo update-rc.d home_server_flic defaults

Start:
sudo service home_server_express start
sudo service home_server_flic start

Stop:
sudo service home_server_express stop
sudo service home_server_flic stop

Uninstall:
home_server_express

Mount Remote:
Instructions: https://www.digitalocean.com/community/tutorials/how-to-use-sshfs-to-mount-remote-file-systems-over-ssh
sudo sshfs -o allow_other,defer_permissions pi@192.168.25.20:projects/ ~/mount/20
