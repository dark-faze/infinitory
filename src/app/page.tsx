'use client'
import React from 'react'
import Navbar from '@/components/Navbar'
import Image from 'next/image'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { storyTypes, artStyles } from '@/data/styleAndStoryData'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowBigRight, Fullscreen, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface SelectedContext {
  storyText: string,
  selectedOption: string
}

export default function Home() {
  const [currentImageLink, setCurrentImageLink] = React.useState('/titleScreen.png')
  const [gameStarted, setGameStarted] = React.useState(false)
  const [bgBlur, setBgBlur] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const [storyType, setStoryType] = React.useState('pirates')
  const [artType, setArtType] = React.useState('Photorealistic')
  const [currentStoryText, setCurrentStoryText] = React.useState('')
  const [currentOptions, setCurrentOptions] = React.useState<string[]>([])
  const [selectedContext, setSelectedContext] = React.useState<SelectedContext[]>([])
  const [showOptionsScreen, setShowOptionsScreen] = React.useState(false)
  const [optionsAreNextScreen, setOptionsAreNextScreen] = React.useState(false)
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  
  const fullScreenRef = React.useRef<HTMLDivElement>(null);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      fullScreenRef.current?.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  function handleJsonParse (jsonString: string) {
    jsonString = jsonString.replace(/\`\`\`json\n/, '').replace(/\n\`\`\`/, '');
    const jsonObject = JSON.parse(jsonString);
    return jsonObject
  }
  // Initital Prompt Trigger
  const handleGameStart = async () => {
    setGameStarted(true)
    setLoading(true)
    setBgBlur(true)

    let response = await axios.post('/api/openAi', {
      theme: storyType,
      isStart: true
    })

    let jsonObject = handleJsonParse(response.data.data)

    setCurrentOptions(jsonObject.options)

    let selectedContextData = []
    selectedContextData.push({
      storyText: jsonObject.storyText,
      selectedOption: ''
    })
    setSelectedContext(selectedContextData)

    let imageRes = await axios.post('/api/dalle3', {
      prompt: jsonObject.imagePrompt,
      artType: artType
    })
    
    console.log(imageRes)

    setLoading(false)
    setCurrentStoryText(jsonObject.storyText)
    setCurrentImageLink(imageRes.data.data[0].url)
    setBgBlur(false)

  }

  const handleNextScreen = async (selectedOption = "") => {

    if (optionsAreNextScreen) {
      setShowOptionsScreen(true)
      setOptionsAreNextScreen(false)
      setBgBlur(true)
      setLoading(false)
      return
    }

    if (selectedOption !== "") {
      let selectedContextData = selectedContext
      selectedContextData.push({
        storyText: currentStoryText,
        selectedOption: selectedOption
      })
      setSelectedContext(selectedContextData)
      setShowOptionsScreen(false)
    }

    setLoading(true)
    if (selectedContext.length > 10) {
      let currentContextData = selectedContext
      currentContextData.shift()
      setSelectedContext(currentContextData)
    }

    let response = await axios.post('/api/openAi', {
      theme: storyType,
      isStart: false,
      lastContext: selectedContext
    })

    // Replicate Image API
    // let imageRes = await axios.post('/api/replicate', {
    //   prompt: jsonObject.imagePrompt,
    //   artType: artType
    // })

    let jsonObject = handleJsonParse(response.data.data)
    setCurrentOptions(jsonObject.options)

    if (jsonObject.options.length > 0) {
      setOptionsAreNextScreen(true)
    }

    let currentContextData = selectedContext
    currentContextData.push({
      storyText: jsonObject.storyText,
      selectedOption: ''
    })

    setSelectedContext(currentContextData)

    let imageRes = await axios.post('/api/dalle3', {
      prompt: jsonObject.imagePrompt,
      artType: artType
    })

    // Replicate Image API
    // let imageRes = await axios.post('/api/replicate', {
    //   prompt: jsonObject.imagePrompt,
    //   artType: artType
    // })

    setLoading(false)
    setCurrentStoryText(jsonObject.storyText)
    setCurrentImageLink(imageRes.data.data[0].url) //Dalle3
    // setCurrentImageLink(imageRes.data.data[0])  //Replicate API
    setBgBlur(false)
  }


  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center px-24 pt-24">
        {/* <h1 className='font-bold mb-8'>Infinite Stories Infinite Worlds 🌟</h1> */}
        <div ref={fullScreenRef} className='relative mb-16'>

          {isFullScreen ? (
            <Image
              src={currentImageLink}
              layout='fill'
              alt="rte"
              objectFit="contain"
              className="p-2 w-64 rounded-md z-0 trueGlass"
            />
          ) : (
            <Image
              src={currentImageLink}
              width={1280}
              height={720}
              alt="rte"
              objectFit="cover"
              className="p-2 rounded-md z-0 max-w-4xl trueGlass"
            />
          )}

          <div className={`absolute p-2 top-0 left-0 ${bgBlur ? 'backdrop-blur-md' : ''} h-full w-full`}>
            <div className='h-full w-full'>
              <div className='h-full flex justify-center items-center'>

                {!gameStarted &&
                  <div className='flex flex-row gap-2 z-40'>

                    <div className=''>
                      <h5>Story Type</h5>
                      <Select onValueChange={(val) => setStoryType(val)} defaultValue={storyType}>
                        <SelectTrigger className="w-[180px] trueGlass">
                          <SelectValue placeholder="Story" />
                        </SelectTrigger>
                        <SelectContent className='trueGlass' position='item-aligned'>
                          {storyTypes.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>


                    <div className=''>
                      <h5>Art Type</h5>
                      <Select onValueChange={(val) => setArtType(val)} defaultValue={artType}>
                        <SelectTrigger className="w-[180px] trueGlass">
                          <SelectValue placeholder="Art" />
                        </SelectTrigger>
                        <SelectContent className='trueGlass' position='item-aligned'>
                          {artStyles.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className=''>
                      <Button className='trueGlass text-white mt-6 hover:bg-slate-900'
                        onClick={handleGameStart}
                      >
                        Start Game
                      </Button>
                    </div>
                  </div>
                }

                {loading &&
                  <Loader2 className="mr-2 animate-spin" size={32} />
                }

                {(gameStarted && !loading) &&
                  <div className='absolute right-0 mr-4'>
                    <Button className='trueGlass text-white mt-6 hover:bg-slate-900'
                      onClick={async () => await handleNextScreen()}
                    >
                      <ArrowBigRight />
                    </Button>
                  </div>
                }

                {showOptionsScreen &&
                  <div className='flex justify-center items-center pb-8 px-16'>
                    <div className='flex flex-col gap-2 mt-4'>
                      {currentOptions.map((option, index) => (
                        <Button className='trueGlass text-white mt-6 hover:bg-slate-900'
                          onClick={async () => await handleNextScreen(option)}
                          key={index}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                }

              </div>
              {(gameStarted && !loading) &&
                <div className='absolute bottom-0 pb-8 px-16 mx-auto w-full'>
                  <h3 className='p-4 bg-black/50 backdrop-blur-sm text-center rounded-md'>{currentStoryText}</h3>
                </div>
              }
            </div>
          </div>

          {gameStarted && <div className='absolute top-0 left-0 p-2 trueGlass' onClick={toggleFullScreen}>
            <Fullscreen />
          </div>}
        </div>

        <div className='relative flex h-16 justify-around w-full text-center'>
          <span className="font-medium text-huntback dark:text-white text-md">
            Made with ☕ by &nbsp;
            <Link className="font-medium hover:underline w-fit" href="https://twitter.com/akhlas_hussain">
              @akhlas_hussain
            </Link>
          </span>
          <span>Give me a follow 💜 would love to connect!</span>
        </div>
      </main>
    </>
  )
}
