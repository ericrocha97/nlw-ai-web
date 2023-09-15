import { useEffect, useState } from "react";
import { Github, Wand2 } from "lucide-react";
import { useCompletion } from "ai/react";

import { ModeToggle } from "./components/mode-toggle";
import { ThemeProvider } from "./components/theme-provider";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Slider } from "./components/ui/slider";
import { VideoInputForm } from "./components/video-input-form";
import { PromptSelect } from "./components/prompt-select";

const URL = import.meta.env.VITE_SERVER_URL;

export function App() {
  const [temperature, setTemperature] = useState<number>(0.5);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [aiCompletion, setAiCompletion] = useState<string>("");

  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
  } = useCompletion({
    api: `${URL}/ai/complete`,
    body: {
      videoId,
      temperature,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    setAiCompletion(completion);
  }, [completion]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen flex flex-col">
        <header className="px-6 py-3 flex items-center justify-between border-b">
          <h1 className="text-xl font-bold">upload.ai</h1>

          <nav className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              Desenvolvido com 💜 no NLW da Rocketseat
            </span>

            <Separator orientation="vertical" className="h-6" />

            <a href="https://github.com/ericrocha97" target="_blank">
              <Button variant={"outline"}>
                <Github className="w-4 h-4 mr-2" />
                Github
              </Button>
            </a>

            <ModeToggle />
          </nav>
        </header>

        <main className="flex-1 p-6 flex gap-6">
          <article className="flex flex-col flex-1 gap-4">
            <section className="grid grid-rows-2 gap-4 flex-1">
              <Textarea
                className="resize-none p-4 leading-relaxed"
                placeholder="Inclua o prompt para a IA..."
                value={input}
                onChange={handleInputChange}
              />

              <Textarea
                className="resize-none p-4 leading-relaxed"
                placeholder="Resultado gerado pela IA..."
                readOnly
                value={aiCompletion}
              />
            </section>

            <p className="text-sm text-muted-foreground">
              Lembre-se: você pode utilizar a variável{" "}
              <code className="text-primary">{`{transcription}`}</code> no seu
              prompt para adicionar o conteúdo da transcrição do vídeo
              selecionado.
            </p>
          </article>

          <aside className="w-80 space-y-6">
            <VideoInputForm
              onVideoUploaded={setVideoId}
              onVideoRemoved={() => {
                setVideoId(null);
                setAiCompletion("");
              }}
            />

            <Separator />

            <form onSubmit={handleSubmit} className="space-y-4">
              <section className="space-y-2">
                <Label>Prompt</Label>
                <PromptSelect onPromptSelected={setInput} />
              </section>

              <section className="space-y-2">
                <Label>Modelo</Label>
                <Select disabled defaultValue="gpt3.5">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
                  </SelectContent>
                </Select>
                <span className="block text-sm text-muted-foreground italic">
                  Você poderá customizar essa opção em breve.
                </span>
              </section>

              <Separator />

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Temperatura</Label>
                  <div>{temperature}</div>
                </div>
                <Slider
                  min={0}
                  max={1}
                  step={0.1}
                  value={[temperature]}
                  onValueChange={(value) => setTemperature(value[0])}
                />
                <span className="block text-sm text-muted-foreground italic leading-relaxed">
                  Valores mais altos tendem a deixar o resultado mais criativo e
                  com possíveis erros.
                </span>
              </section>

              <Separator />

              <Button
                disabled={!videoId || isLoading || !input}
                type="submit"
                className="w-full"
              >
                {!videoId ? (
                  "Carregue um vídeo"
                ) : isLoading ? (
                  "Executando..."
                ) : !input ? (
                  "Selecione um prompt para a IA"
                ) : (
                  <>
                    Executar
                    <Wand2 className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </aside>
        </main>
      </div>
    </ThemeProvider>
  );
}
