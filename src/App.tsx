import { useEffect, useMemo, useRef, useState } from 'react'
import Confetti from 'react-confetti'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BrainCircuit,
  CandlestickChart,
  CheckCircle2,
  Cpu,
  Gift,
  LockKeyhole,
  Play,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Terminal,
  Trophy,
  XCircle,
  Zap,
} from 'lucide-react'
import { questions, type AnswerOption, type AnswerId, type QuizQuestion } from './quizData'

type GameStage = 'start' | 'quiz' | 'complete'
type FeedbackState = 'idle' | 'wrong' | 'correct'
type ToastState = {
  id: number
  text: string
  tone: 'error' | 'success'
}

const roastLines = [
  'Da hat das Ritalin wohl nicht gewirkt!',
  'Bist du ein NPC?',
  'Skill Issue!',
  'Wallstreet würde den Trade direkt liquidieren.',
  '404: Gehirnzelle nicht gefunden.',
  'Bro, das war kein Alpha-Move.',
]

const voucherPayload = [84, 102, 97, 18, 126, 65, 102, 99, 9, 22, 41, 6, 113, 12, 17, 67]
const voucherKey = [17, 43, 59, 71, 83]

function revealVoucher() {
  return String.fromCharCode(
    ...voucherPayload.map((value, index) => value ^ voucherKey[index % voucherKey.length]),
  )
}

function App() {
  const [stage, setStage] = useState<GameStage>('start')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedId, setSelectedId] = useState<AnswerId | null>(null)
  const [feedback, setFeedback] = useState<FeedbackState>('idle')
  const [toast, setToast] = useState<ToastState | null>(null)
  const [shakeTick, setShakeTick] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const windowSize = useWindowSize()

  const currentQuestion = questions[questionIndex]
  const passed = stage === 'complete' && correctCount >= 8
  const voucher = useMemo(() => (passed ? revealVoucher() : ''), [passed])
  const answeredCount = stage === 'complete'
    ? questions.length
    : stage === 'quiz'
      ? questionIndex + (feedback === 'idle' ? 0 : 1)
      : 0
  const progress = (answeredCount / questions.length) * 100

  useEffect(() => {
    if (!toast) {
      return
    }

    const timeout = window.setTimeout(() => setToast(null), toast.tone === 'error' ? 1900 : 1250)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const publishToast = (text: string, tone: ToastState['tone']) => {
    setToast((currentToast) => ({ id: (currentToast?.id ?? 0) + 1, text, tone }))
  }

  const startQuiz = () => {
    setQuestionIndex(0)
    setSelectedId(null)
    setFeedback('idle')
    setToast(null)
    setMistakes(0)
    setCorrectCount(0)
    setStage('quiz')
  }

  const restartQuiz = () => {
    setStage('start')
    setQuestionIndex(0)
    setSelectedId(null)
    setFeedback('idle')
    setToast(null)
    setMistakes(0)
    setCorrectCount(0)
  }

  const handleAnswer = (answer: AnswerOption) => {
    if (feedback !== 'idle') {
      return
    }

    setSelectedId(answer.id)

    if (answer.id !== currentQuestion.correctAnswer) {
      const nextMistakes = mistakes + 1
      const roast = roastLines[(nextMistakes + answer.id.charCodeAt(0)) % roastLines.length]
      setMistakes(nextMistakes)
      setFeedback('wrong')
      setShakeTick((tick) => tick + 1)
      publishToast(roast, 'error')
    } else {
      setCorrectCount((count) => count + 1)
      setFeedback('correct')
      publishToast('ACCESS GRANTED. Alpha entdeckt.', 'success')
    }

    window.setTimeout(() => {
      if (questionIndex === questions.length - 1) {
        setStage('complete')
        return
      }

      setQuestionIndex((index) => index + 1)
      setSelectedId(null)
      setFeedback('idle')
    }, 820)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#03060a] text-slate-100">
      <AmbientBackground />
      <TerminalHeader stage={stage} progress={progress} />
      <main className="relative z-10">
        <AnimatePresence initial={false}>
          {stage === 'start' && <StartScreen key="start" onStart={startQuiz} />}
          {stage === 'quiz' && (
            <QuizScreen
              key="quiz"
              question={currentQuestion}
              questionIndex={questionIndex}
              totalQuestions={questions.length}
              progress={progress}
              selectedId={selectedId}
              feedback={feedback}
              shakeTick={shakeTick}
              mistakes={mistakes}
              correctCount={correctCount}
              onAnswer={handleAnswer}
            />
          )}
          {stage === 'complete' && (
            <ResultScreen
              key="complete"
              onRestart={restartQuiz}
              voucher={voucher}
              score={correctCount}
              totalQuestions={questions.length}
              passed={passed}
              windowSize={windowSize}
            />
          )}
        </AnimatePresence>
      </main>
      <Toast toast={toast} />
    </div>
  )
}

type HeaderProps = {
  stage: GameStage
  progress: number
}

function TerminalHeader({ stage, progress }: HeaderProps) {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-md border border-emerald-300/35 bg-emerald-400/10 shadow-[0_0_34px_rgba(16,185,129,0.24)]">
          <Terminal className="size-5 text-emerald-300" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-mono text-sm font-semibold uppercase text-emerald-100">
            Steffan Capital Quiz
          </p>
          <p className="font-mono text-[11px] uppercase text-cyan-200/55">
            {stage === 'start' ? 'BOOT SEQUENCE' : stage === 'quiz' ? 'LIVE DESK' : 'SCORE REPORT'}
          </p>
        </div>
      </div>

      <div className="hidden min-w-0 flex-1 items-center justify-center gap-3 lg:flex">
        <MarketPill label="GÖNNERGY" value="+420.69%" tone="green" />
        <MarketPill label="FOCUS" value="VOLATILE" tone="cyan" />
        <MarketPill label="NPC INDEX" value="-13.37%" tone="violet" />
      </div>

      <div className="w-28 sm:w-44">
        <div className="mb-1 flex justify-between font-mono text-[10px] uppercase text-slate-400">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-400"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          />
        </div>
      </div>
    </header>
  )
}

type MarketPillProps = {
  label: string
  value: string
  tone: 'green' | 'cyan' | 'violet'
}

function MarketPill({ label, value, tone }: MarketPillProps) {
  const toneClass = {
    green: 'border-emerald-300/20 text-emerald-200',
    cyan: 'border-cyan-300/20 text-cyan-200',
    violet: 'border-violet-300/20 text-violet-200',
  }[tone]

  return (
    <div className={`rounded-md border bg-white/[0.035] px-3 py-1.5 font-mono text-[11px] ${toneClass}`}>
      <span className="mr-2 text-slate-500">{label}</span>
      <span>{value}</span>
    </div>
  )
}

type StartScreenProps = {
  onStart: () => void
}

function StartScreen({ onStart }: StartScreenProps) {
  return (
    <motion.section
      className="mx-auto flex min-h-[calc(100svh-88px)] w-full max-w-7xl items-center px-4 pb-10 pt-4 sm:px-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,0.94fr)_minmax(340px,0.62fr)]">
        <div className="max-w-4xl">
          <motion.div
            className="mb-6 inline-flex items-center gap-2 border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 font-mono text-xs uppercase text-emerald-200"
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Cpu className="size-4" aria-hidden="true" />
            Alpha Testnet Armed
          </motion.div>
          <h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.96] text-white sm:text-7xl lg:text-8xl">
            Steffan
            <span className="block bg-gradient-to-r from-emerald-200 via-cyan-200 to-violet-300 bg-clip-text text-transparent">
              Capital Quiz
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Zehn interne Insider-Fragen. Jede Antwort zählt genau einmal. Ab 8/10 öffnet sich
            der Gutschein-Vault.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <motion.button
              type="button"
              data-testid="start-quiz"
              onClick={onStart}
              className="group inline-flex h-14 items-center justify-center gap-3 rounded-md border border-emerald-200/50 bg-emerald-300 px-7 font-mono text-sm font-black uppercase text-black shadow-[0_0_45px_rgba(52,211,153,0.38)] outline-none transition hover:bg-cyan-200 focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#03060a]"
              whileHover={{ y: -2, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="size-5 fill-black transition group-hover:translate-x-0.5" aria-hidden="true" />
              Quiz Starten
            </motion.button>
            <div className="flex flex-wrap gap-2 font-mono text-[11px] uppercase text-slate-400">
              <span className="border border-white/10 bg-white/[0.045] px-3 py-2">10 Fragen</span>
              <span className="border border-white/10 bg-white/[0.045] px-3 py-2">8/10 Unlock</span>
              <span className="border border-white/10 bg-white/[0.045] px-3 py-2">30€ Vault</span>
            </div>
          </div>
        </div>

        <motion.div
          className="relative min-h-[420px] overflow-hidden rounded-lg border border-white/12 bg-white/[0.055] p-5 shadow-[0_30px_120px_rgba(0,0,0,0.62)] backdrop-blur-2xl"
          initial={{ opacity: 0, scale: 0.96, rotateX: 8 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.20),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.18),transparent_28%)]" />
          <div className="relative flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="font-mono text-xs uppercase text-cyan-200/70">Vault Preview</p>
              <p className="mt-1 text-2xl font-black text-white">****-*****-****</p>
            </div>
            <LockKeyhole className="size-7 text-emerald-300" aria-hidden="true" />
          </div>
          <div className="relative mt-8 grid gap-3">
            {['Wohnung Hannover', 'Uni 1,0 Play', 'Polymarket Bet', 'Supplement Method'].map((item, index) => (
              <motion.div
                key={item}
                className="flex items-center justify-between border border-white/10 bg-black/25 px-4 py-4"
                animate={{ opacity: [0.72, 1, 0.72] }}
                transition={{ duration: 2.6, delay: index * 0.18, repeat: Infinity }}
              >
                <span className="font-mono text-sm uppercase text-slate-300">{item}</span>
                <span className="font-mono text-xs text-emerald-300">LOCKED</span>
              </motion.div>
            ))}
          </div>
          <div className="relative mt-8 h-24 overflow-hidden border border-emerald-300/20 bg-emerald-300/5">
            <div className="market-ticker whitespace-nowrap py-8 font-mono text-sm uppercase text-emerald-200/70">
              STEFFAN.AI +99.1% / RUDI-KRIEGER FUTURES +42.0% / HONEY INDEX ATH / NPC RISK HIGH /
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

type QuizScreenProps = {
  question: QuizQuestion
  questionIndex: number
  totalQuestions: number
  progress: number
  selectedId: AnswerId | null
  feedback: FeedbackState
  shakeTick: number
  mistakes: number
  correctCount: number
  onAnswer: (answer: AnswerOption) => void
}

function QuizScreen({
  question,
  questionIndex,
  totalQuestions,
  progress,
  selectedId,
  feedback,
  shakeTick,
  mistakes,
  correctCount,
  onAnswer,
}: QuizScreenProps) {
  const questionCode = useMemo(
    () => `Q-${String(questionIndex + 1).padStart(2, '0')}/${String(totalQuestions).padStart(2, '0')}`,
    [questionIndex, totalQuestions],
  )

  return (
    <motion.section
      className="mx-auto grid min-h-[calc(100svh-88px)] w-full max-w-7xl items-center gap-5 px-4 pb-8 pt-3 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)]"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <aside className="hidden h-[620px] flex-col justify-between border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl lg:flex">
        <div>
          <div className="mb-8 flex items-center gap-3">
            <div className="grid size-10 place-items-center border border-cyan-300/25 bg-cyan-300/10">
              <CandlestickChart className="size-5 text-cyan-200" aria-hidden="true" />
            </div>
            <div>
              <p className="font-mono text-xs uppercase text-slate-500">Session</p>
              <p className="font-mono text-sm uppercase text-white">Birthday Desk</p>
            </div>
          </div>
          <div className="space-y-3">
            {questions.map((item, index) => {
              const isActive = index === questionIndex
              const isDone = index < questionIndex || (isActive && feedback !== 'idle')
              return (
                <div key={item.id} className="flex items-center gap-3">
                  <span
                    className={`h-2 flex-1 rounded-full ${
                      isDone
                        ? 'bg-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.65)]'
                        : isActive
                          ? 'bg-cyan-300'
                          : 'bg-white/10'
                    }`}
                  />
                  <span className="w-8 font-mono text-xs text-slate-500">{String(index + 1).padStart(2, '0')}</span>
                </div>
              )
            })}
          </div>
        </div>
        <div className="space-y-4 border-t border-white/10 pt-5">
          <StatusRow label="Score" value={`${correctCount}/${totalQuestions}`} tone="green" />
          <StatusRow label="Missclicks" value={String(mistakes)} tone="red" />
          <StatusRow label="Vault" value={progress >= 100 ? 'Open' : 'Armed'} tone="cyan" />
        </div>
      </aside>

      <div className="relative overflow-hidden rounded-lg border border-white/12 bg-white/[0.055] p-4 shadow-[0_30px_120px_rgba(0,0,0,0.62)] backdrop-blur-2xl sm:p-6 lg:p-8">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(16,185,129,0.10),transparent_36%,rgba(56,189,248,0.08)_62%,rgba(168,85,247,0.10))]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/80 to-transparent" />
        <div className="relative">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase text-emerald-200/70">{questionCode}</p>
              <h2 className="mt-2 max-w-4xl text-2xl font-black leading-tight text-white sm:text-4xl">
                {question.question}
              </h2>
            </div>
            <div className="flex items-center gap-2 self-start border border-violet-300/20 bg-violet-300/10 px-3 py-2 font-mono text-xs uppercase text-violet-100">
              <BrainCircuit className="size-4" aria-hidden="true" />
              Alpha Scan
            </div>
          </div>

          <QuestionVisual question={question} />

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-black/35">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-400"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.42, ease: 'easeOut' }}
            />
          </div>

          <div className="mt-6 grid gap-3 sm:gap-4">
            {question.answers.map((answer) => (
              <AnswerButton
                key={`${answer.id}-${selectedId === answer.id && feedback === 'wrong' ? shakeTick : 'stable'}`}
                answer={answer}
                correctAnswer={question.correctAnswer}
                selectedId={selectedId}
                feedback={feedback}
                onAnswer={onAnswer}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 font-mono text-xs uppercase text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>Rule: jede Frage zählt einmal. Ab 8/10 öffnet sich der Vault.</span>
            <span>{questionIndex + 1} / {totalQuestions}</span>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

type QuestionVisualProps = {
  question: QuizQuestion
}

function QuestionVisual({ question }: QuestionVisualProps) {
  return (
    <motion.figure
      key={question.id}
      className="relative mt-5 overflow-hidden rounded-md border border-cyan-200/20 bg-black/35 shadow-[0_20px_70px_rgba(34,211,238,0.10)]"
      initial={{ opacity: 0, y: 12, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative aspect-[1672/928] w-full bg-black/45">
        <img
          src={question.image}
          alt={question.imageAlt}
          className="absolute inset-0 h-full w-full object-contain object-center saturate-125"
          loading="eager"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(3,6,10,0.12),transparent_35%,rgba(3,6,10,0.16)),radial-gradient(circle_at_20%_5%,rgba(52,211,153,0.12),transparent_32%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-200/80 to-transparent" />
      </div>
      <figcaption className="border-t border-cyan-200/10 bg-black/30 px-3 py-2 font-mono text-[10px] uppercase text-cyan-100/80">
        Visual Evidence // keine Spoiler
      </figcaption>
    </motion.figure>
  )
}

type AnswerButtonProps = {
  answer: AnswerOption
  correctAnswer: AnswerId
  selectedId: AnswerId | null
  feedback: FeedbackState
  onAnswer: (answer: AnswerOption) => void
}

function AnswerButton({ answer, correctAnswer, selectedId, feedback, onAnswer }: AnswerButtonProps) {
  const isSelected = selectedId === answer.id
  const isAnswered = feedback !== 'idle'
  const isWrong = isSelected && feedback === 'wrong'
  const isCorrect = isAnswered && answer.id === correctAnswer
  const Icon = isCorrect ? CheckCircle2 : isWrong ? XCircle : Zap
  const stateClass = isCorrect
    ? 'border-emerald-300/80 bg-emerald-300/15 text-emerald-50 shadow-[0_0_42px_rgba(52,211,153,0.34)]'
    : isWrong
      ? 'border-red-400/90 bg-red-500/15 text-red-100 shadow-[0_0_34px_rgba(248,113,113,0.30)]'
      : 'border-white/10 bg-white/[0.055] text-slate-100 hover:border-cyan-200/45 hover:bg-cyan-200/10'

  return (
    <motion.button
      type="button"
      data-testid={`answer-${answer.id}`}
      disabled={isAnswered}
      onClick={() => onAnswer(answer)}
      className={`group relative flex min-h-20 w-full items-center gap-4 overflow-hidden rounded-md border px-4 py-4 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d] sm:px-5 ${stateClass}`}
      animate={
        isWrong
          ? { x: [0, -11, 10, -8, 7, 0], scale: [1, 1.012, 1] }
          : isCorrect
            ? { scale: [1, 1.018, 1], y: [0, -2, 0] }
            : { x: 0, scale: 1, y: 0 }
      }
      transition={{ duration: isWrong ? 0.44 : 0.36, ease: 'easeOut' }}
      whileHover={isAnswered ? undefined : { y: -2 }}
      whileTap={isAnswered ? undefined : { scale: 0.99 }}
    >
      <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-emerald-300 via-cyan-300 to-violet-400 opacity-70" />
      <span className="grid size-11 shrink-0 place-items-center rounded-md border border-current/20 bg-black/30 font-mono text-base font-black">
        {answer.id}
      </span>
      <span className="min-w-0 flex-1 text-sm font-semibold leading-6 sm:text-base">{answer.text}</span>
      <Icon className="size-5 shrink-0 opacity-80" aria-hidden="true" />
    </motion.button>
  )
}

type StatusRowProps = {
  label: string
  value: string
  tone: 'green' | 'red' | 'cyan'
}

function StatusRow({ label, value, tone }: StatusRowProps) {
  const toneClass = {
    green: 'text-emerald-300',
    red: 'text-red-300',
    cyan: 'text-cyan-300',
  }[tone]

  return (
    <div className="flex items-center justify-between font-mono text-xs uppercase">
      <span className="text-slate-500">{label}</span>
      <span className={toneClass}>{value}</span>
    </div>
  )
}

type ResultScreenProps = {
  onRestart: () => void
  voucher: string
  score: number
  totalQuestions: number
  passed: boolean
  windowSize: {
    width: number
    height: number
  }
}

function ResultScreen({ onRestart, voucher, score, totalQuestions, passed, windowSize }: ResultScreenProps) {
  const ResultIcon = passed ? Trophy : LockKeyhole
  const missingPoints = Math.max(8 - score, 0)

  return (
    <motion.section
      className="relative mx-auto flex min-h-[calc(100svh-88px)] w-full max-w-7xl items-center px-4 pb-10 pt-4 sm:px-6"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {passed && windowSize.width > 0 && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={520}
          gravity={0.18}
          colors={['#34d399', '#22d3ee', '#a78bfa', '#f8fafc', '#facc15']}
        />
      )}
      <div
        className={`relative w-full overflow-hidden rounded-lg border bg-white/[0.065] p-5 backdrop-blur-2xl sm:p-7 lg:p-9 ${
          passed
            ? 'border-emerald-200/30 shadow-[0_30px_140px_rgba(16,185,129,0.22)]'
            : 'border-red-300/25 shadow-[0_30px_140px_rgba(248,113,113,0.16)]'
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_0%,rgba(52,211,153,0.20),transparent_36%),radial-gradient(circle_at_72%_20%,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.18),transparent_38%)]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <motion.div
            className={`mx-auto mb-5 grid size-16 place-items-center rounded-md border ${
              passed
                ? 'border-emerald-200/40 bg-emerald-300/15 shadow-[0_0_70px_rgba(52,211,153,0.48)]'
                : 'border-red-200/35 bg-red-400/12 shadow-[0_0_70px_rgba(248,113,113,0.32)]'
            }`}
            animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.06, 1] }}
            transition={{ duration: 2.4, repeat: Infinity }}
          >
            <ResultIcon className={`size-8 ${passed ? 'text-emerald-200' : 'text-red-200'}`} aria-hidden="true" />
          </motion.div>
          <p className={`font-mono text-sm font-semibold uppercase ${passed ? 'text-emerald-200' : 'text-red-200'}`}>
            {passed ? 'Vault breached' : 'Vault locked'}
          </p>
          <h2 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            {passed ? 'Herzlichen Glückwunsch, Mastermind!' : 'Noch nicht genug Alpha.'}
          </h2>

          <div className="mx-auto mt-5 max-w-3xl border border-white/12 bg-black/35 p-4 sm:p-5">
            <p className="font-mono text-xs font-semibold uppercase text-slate-400">Final Score</p>
            <p data-testid="final-score" className="mt-2 text-4xl font-black text-white sm:text-5xl">
              {score} / {totalQuestions}
            </p>
            <p className="mt-2 font-mono text-xs uppercase text-slate-400">
              {passed
                ? '8/10 erreicht. Der Gutschein-Vault ist offen.'
                : `Du brauchst mindestens 8 richtige. Es fehlen noch ${missingPoints} Punkt${missingPoints === 1 ? '' : 'e'}.`}
            </p>
          </div>

          {passed ? (
            <div className="mx-auto mt-5 max-w-4xl border border-cyan-200/25 bg-black/35 p-4 sm:p-5">
              <p className="text-xl font-black leading-tight text-white sm:text-2xl">
                Hier ist dein 30€ Amazon-Gutschein:
              </p>
              <SecureVoucher value={voucher} />
            </div>
          ) : (
            <div className="mx-auto mt-5 max-w-3xl border border-red-300/25 bg-red-500/10 p-4 font-mono text-sm uppercase text-red-100 sm:p-5">
              Vault bleibt zu. Nochmal starten, mehr Brain-Calls landen, dann gibt es den Code.
            </div>
          )}

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              data-testid="restart-quiz"
              onClick={onRestart}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/15 bg-white/[0.07] px-5 font-mono text-xs font-bold uppercase text-white outline-none transition hover:border-cyan-200/45 hover:bg-cyan-200/10 focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d]"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Nochmal spielen
            </button>
            <div
              className={`inline-flex h-11 items-center gap-2 border px-5 font-mono text-xs uppercase ${
                passed
                  ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-200'
                  : 'border-red-300/25 bg-red-400/10 text-red-100'
              }`}
            >
              {passed ? <Gift className="size-4" aria-hidden="true" /> : <ShieldAlert className="size-4" aria-hidden="true" />}
              {passed ? 'Coupon secured' : 'Retry required'}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

type SecureVoucherProps = {
  value: string
}

function SecureVoucher({ value }: SecureVoucherProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !value) {
      return
    }

    const renderVoucher = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.max(320, rect.width)
      const height = Math.max(84, rect.height)
      const context = canvas.getContext('2d')

      if (!context) {
        return
      }

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      const gradient = context.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.15)')
      gradient.addColorStop(0.52, 'rgba(34, 211, 238, 0.12)')
      gradient.addColorStop(1, 'rgba(167, 139, 250, 0.18)')
      context.fillStyle = '#061018'
      context.fillRect(0, 0, width, height)
      context.fillStyle = gradient
      context.fillRect(0, 0, width, height)

      context.strokeStyle = 'rgba(103, 232, 249, 0.32)'
      context.lineWidth = 1
      context.strokeRect(0.5, 0.5, width - 1, height - 1)

      context.fillStyle = 'rgba(165, 243, 252, 0.7)'
      context.font = '700 11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
      context.textAlign = 'center'
      context.fillText('SECURE CANVAS OUTPUT', width / 2, 22)

      const fontSize = Math.max(23, Math.min(42, width / 13.5))
      context.fillStyle = '#a7f3d0'
      context.shadowColor = 'rgba(52, 211, 153, 0.55)'
      context.shadowBlur = 18
      context.font = `900 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
      context.fillText(value, width / 2, height / 2 + fontSize / 2.7)
      context.shadowBlur = 0
    }

    renderVoucher()
    const observer = new ResizeObserver(renderVoucher)
    observer.observe(canvas)
    window.addEventListener('resize', renderVoucher)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', renderVoucher)
    }
  }, [value])

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Der Gutschein-Code wird erst nach dem Sieg als Canvas-Grafik angezeigt."
      className="mt-4 h-24 w-full rounded-sm sm:h-28"
    />
  )
}

type ToastProps = {
  toast: ToastState | null
}

function Toast({ toast }: ToastProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-50 flex justify-center px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            role="alert"
            className={`flex max-w-lg items-center gap-3 rounded-md border px-4 py-3 font-mono text-sm font-bold uppercase shadow-[0_18px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl ${
              toast.tone === 'error'
                ? 'border-red-300/40 bg-red-500/15 text-red-100'
                : 'border-emerald-300/40 bg-emerald-400/15 text-emerald-100'
            }`}
            initial={{ opacity: 0, y: -18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.96 }}
            transition={{ duration: 0.22 }}
          >
            {toast.tone === 'error' ? (
              <ShieldAlert className="size-5 shrink-0" aria-hidden="true" />
            ) : (
              <Sparkles className="size-5 shrink-0" aria-hidden="true" />
            )}
            <span>{toast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_5%,rgba(16,185,129,0.16),transparent_30%),radial-gradient(circle_at_85%_12%,rgba(34,211,238,0.15),transparent_34%),radial-gradient(circle_at_52%_88%,rgba(124,58,237,0.18),transparent_38%),linear-gradient(180deg,#03060a_0%,#071018_48%,#03060a_100%)]" />
      <div className="terminal-grid absolute inset-0 opacity-55" />
      <div className="scanline absolute inset-0 opacity-40" />
      <div className="absolute left-1/2 top-1/2 h-[740px] w-[740px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />
      <div className="absolute -left-28 top-28 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />
      <div className="absolute -right-24 bottom-24 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="market-ticker absolute bottom-8 left-0 whitespace-nowrap font-mono text-xs uppercase text-cyan-200/20">
        NASDAQ // STEFFAN GPT // CUSTOMCUP // POLYMARKET // HONEY // LIDL RISK // VAULT ACCESS //
        NASDAQ // STEFFAN GPT // CUSTOMCUP // POLYMARKET // HONEY // LIDL RISK // VAULT ACCESS //
      </div>
    </div>
  )
}

function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return size
}

export default App
