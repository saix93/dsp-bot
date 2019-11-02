"# dsp-bot" 

Necesita tener instalado FFMPEG y Python para ejecutar ciertos comandos.

Para funcionar correctamente en Linux, hay que actualizar la librería de DiscordJS -> npm install discord.js

Actualmente el bot se está hosteando en una máquina virtual de Ubuntu en Amazon Web Services (EC2), desde la cuenta de Raúl.

Instrucciones de uso:

  - Conectarse a la máquina de AWS por SSH (se necesita la clave privada)
  - Escribir ```tmux attach``` para conectarse a la terminal virtual
  - Una vez estás conectado, puedes utilizar ```jobs``` para mostrar una lista de las tareas en background y ```bg``` y ```fg``` para utilizarlas en background o foreground
  - Cuando se abra un proceso (Por ejemplo: Un servidor de Node) utilizar ```CTRL + Z``` para dejarlo en segundo plano, y después ```bg``` para reanudarlo
  - A la hora de cerrar la conexión, hay que hacer ```CTRL + B, D```, esto cierra la conexión con la terminal virtual. Después de esto ya podemos cerrar la conexión SSH. Todo esto nos permite poder seguir utilizando el comando jobs para ver las tareas en segundo plano incluso después de haber cerrado y reabierto la conexión
