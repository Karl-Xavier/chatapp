#  // Audio Recorder

 const startRecording = async () => {
   const stream = await navigator.mediaDevices.getUserMedia({
      audio: true
    })
    const mediaRecorder = new MediaRecorder(stream)

    const chunks = []
    mediaRecorder.ondataavailable = e => {
      chunks.push(e.data)
    }
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, {
        type: 'audio/wav'
      })
      const audioRef = storage.ref().child('audio/'+ Date.now() + '.wav')
      await audioRef.put(blob)
      setRecording(audioRef)
    }

    mediaRecorder.start()
    setTimeout(() => {
      mediaRecorder.stop()
      stream.getTracks().forEach(track => track.stop())
    }, 5000)
  }

  const playRecord = () => {
    if(recording){
      recording.getDownloadURL()
       .then(url => {
        const audio = new Audio(url)
        audio.play()
       })
    }
  }