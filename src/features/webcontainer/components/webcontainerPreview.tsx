import { TemplateFolder } from '@/features/playground/lib/path-to-json'
import { WebContainer } from '@webcontainer/api'
import React, { use, useEffect, useRef, useState } from 'react'
import { set } from 'zod';
import { transformToWebContainerFormat } from '../hooks/transformer';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import TerminalComponent from './terminal';

interface WebContainerPreviewProps {
  serverUrl: string,
  templateData: TemplateFolder,
  isLoading: boolean,
  error: string | null,
  instance: WebContainer | null,
  writeFileSync: (path: string, content: string) => Promise<void>
  forceResetup?: boolean;
}

const WebContainerPreview = ({ templateData, serverUrl, isLoading, error, instance, writeFileSync, forceResetup = false }: WebContainerPreviewProps) => {

  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [loadingstate, setLoadingstate] = useState({
    transforming: false,
    mounting: false,
    installing: false,
    starting: false,
    ready: false
  })
  const [currentStep, setCurrentStep] = useState(0)
  const totalSteps = 4;
  const [setupError, setSetupError] = useState<string | null>(null)
  const [isSetupComplete, setIsSetupComplete] = useState<boolean>(false)
  const [isSetupInProgress, setIsSetupInProgress] = useState<boolean>(false)

  const terminalRef = useRef<any>(null)
  useEffect(() => {
    if (forceResetup) {
      setIsSetupComplete(false)
      setIsSetupInProgress(false)
      setPreviewUrl("")
      setCurrentStep(0)
      setLoadingstate({
        transforming: false,
        mounting: false,
        installing: false,
        starting: false,
        ready: false
      })
    }
  }, [forceResetup])

  useEffect(() => {
    async function setupContainer() {
      if (!instance || isSetupComplete || isSetupInProgress) return;

      try {
        setIsSetupInProgress(true)
        setSetupError(null)

        try {
          const packageJsonexists = await instance.fs.readFile("package.json", "utf8")
          if (packageJsonexists) {
            //terminal related funcs
            if (terminalRef.current?.writeToTerminal) {
              terminalRef.current.writeToTerminal("🔄 Reconnecting to existing WebContainer session...\r\n");
            }
            //@ts-ignore
            instance.on("server-ready", (port: string, url: string) => {
              console.log(`Reconnected to server on port ${port} at ${url}`);
              if (terminalRef.current?.writeToTerminal) {
                terminalRef.current.writeToTerminal(`🌐 Reconnected to server at ${url}\r\n`);
              }

              setPreviewUrl(url)
              setLoadingstate((prev) => ({ ...prev, starting: false, ready: true }))

              setIsSetupComplete(true)
              setIsSetupInProgress(false)
            })

            setCurrentStep(4)
            setLoadingstate((prev) => ({
              ...prev,
              starting: true
            }))
            return;
          }
        } catch (error) {

        }

        setLoadingstate((prev) => ({ ...prev, transforming: true }))
        setCurrentStep(1)

        if (terminalRef.current?.writeToTerminal) {
          terminalRef.current.writeToTerminal(`Transforming related data...\r\n`);
        }

        //@ts-ignore
        const files = transformToWebContainerFormat(templateData)
        setLoadingstate((prev) => ({ ...prev, transforming: false, mounting: true }))
        setCurrentStep(2)

        if (terminalRef.current?.writeToTerminal) {
          terminalRef.current.writeToTerminal(`📂Mounting files to webcontainer...\r\n`);
        }

        await instance.mount(files)

        setLoadingstate((prev) => ({ ...prev, mounting: false, installing: true }))
        setCurrentStep(3)
        if (terminalRef.current?.writeToTerminal) {
          terminalRef.current.writeToTerminal(` 📦 Installing Dependencies...\r\n`);
        }

        const installProcess = await instance.spawn("npm", ["install"])

        installProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              //write direclty to terminal
              if (terminalRef?.current?.writeToTerminal) {
                terminalRef.current.writeToTerminal(data.toString())
              }
            }
          })
        )

        const installExitCode = await installProcess.exit;

        if (installExitCode !== 0) {
          throw new Error(`Failed to installd dependencies.Exit Code: ${installExitCode}`)
        }

        if (terminalRef.current?.writeToTerminal) {
          terminalRef.current.writeToTerminal(`✅ Dependencies installed successfully...\r\n`);
        }

        setLoadingstate((prev) => ({ ...prev, installing: false, starting: true }))
        setCurrentStep(4)

        const startProcess = await instance.spawn("npm", ["run", "start"]);

        // Listen for server ready event
        instance.on("server-ready", (port: number, url: string) => {
          console.log(`Server ready on port ${port} at ${url}`);
          if (terminalRef.current?.writeToTerminal) {
            terminalRef.current.writeToTerminal(`🌐 Server ready at ${url}...\r\n`);
          }

          setPreviewUrl(url);
          setLoadingstate((prev) => ({
            ...prev,
            starting: false,
            ready: true,
          }));
          setIsSetupComplete(true);
          setIsSetupInProgress(false);
        });

        // Handle start process output - stream to terminal
        startProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              if (terminalRef?.current?.writeToTerminal) {
                terminalRef.current.writeToTerminal(data.toString())
              }
            },
          })
        );

      } catch (err) {
        console.error("Error setting up container:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);
         if(terminalRef?.current?.writeToTerminal){
                terminalRef.current.writeToTerminal(`❌Error: ${errorMessage}\r\n`);
              }

        setSetupError(`12 ${errorMessage}`);
        setIsSetupInProgress(false);
        setLoadingstate({
          transforming: false,
          mounting: false,
          installing: false,
          starting: false,
          ready: false,
        });
      }
    }

    setupContainer()

  }, [instance, templateData, isSetupComplete, isSetupInProgress])

  useEffect(() => {
    return () => {

    }
  }, [])

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md p-6 rounded-lg bg-gray-50 dark:bg-gray-900">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <h3 className="text-lg font-medium">Initializing WebContainer</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Setting up the environment for your project...
          </p>
        </div>
      </div>
    );
  }

  if (error || setupError) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-lg max-w-md">
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="h-5 w-5" />
            <h3 className="font-semibold">Error</h3>
          </div>
          <p className="text-sm">{error || setupError}</p>
        </div>
      </div>
    );
  }

  const getStepIcon = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (stepIndex === currentStep) {
      return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
    } else {
      return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStepText = (stepIndex: number, label: string) => {
    const isActive = stepIndex === currentStep;
    const isComplete = stepIndex < currentStep;

    return (
      <span className={`text-sm font-medium ${isComplete ? 'text-green-600' :
        isActive ? 'text-blue-600' :
          'text-gray-500'
        }`}>
        {label}
      </span>
    );
  };

  return (
    <div className='h-full flex flex-col w-full'>
      {
        !previewUrl ? (
          <div className='h-full flex flex-col'>
            <div className='max-h-lg  max-w-md p-6 m-5 rounded-lg bg-white dark:bg-zinc-800 shadow-sm mx-auto'>
              <h3 className='text-lg font-medium mb-4'>
                Setting up your environment
              </h3>
              <Progress
                value={(currentStep / totalSteps) * 100}
                className="h-2 mb-6 bg-white text-white"
              />

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  {getStepIcon(1)}
                  {getStepText(1, "Transforming template data")}
                </div>
                <div className="flex items-center gap-3">
                  {getStepIcon(2)}
                  {getStepText(2, "Mounting files")}
                </div>
                <div className="flex items-center gap-3">
                  {getStepIcon(3)}
                  {getStepText(3, "Installing dependencies")}
                </div>
                <div className="flex items-center gap-3">
                  {getStepIcon(4)}
                  {getStepText(4, "Starting development server")}
                </div>
              </div>
            </div>

            <div className=' h-64 flex-1 p-4'>
              <TerminalComponent
              ref={terminalRef}
              webContainerInstance={instance}
              theme='dark'
              className='h-full'
              />
            </div>
          </div>
        ) : (
          <div className='h-full flex flex-col'>
            <div className='flex-1'>
              <iframe src={previewUrl} className='w-full h-full border-none' title="WebContainer Preview" />
            </div>

            <div className='h-64 border-t'>
              <TerminalComponent
              ref={terminalRef}
              webContainerInstance={instance}
              theme='dark'
              className='h-full'
              />
            </div>
          </div>
        )
      }
    </div>
  )
}

export default WebContainerPreview