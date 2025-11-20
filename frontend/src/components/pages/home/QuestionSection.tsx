import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type AccordionItems = {
  value: string
  question: string
  answer: string
}

export default function QuestionSection() {
  const { t } = useTranslation()
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const items: AccordionItems[] = [
    { value: 'item-1', question: t('question1'), answer: t('answer1') },
    { value: 'item-2', question: t('question2'), answer: t('answer2') },
    { value: 'item-3', question: t('question3'), answer: t('answer3') },
  ]

  const handleClick = (value: string) => {
    setOpenItems(prev => ({ ...prev, [value]: !prev[value] }))
  }

  return (
    <section className="bg-blue-50 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-10">
      <h1 className="font-bgCaps text-xl text-blue-900">
        {t('questionsHead')}
      </h1>
      <div className="mt-6 flex flex-col gap-4">
        {items.map(item => (
          <Accordion
            key={item.value}
            type="single"
            collapsible
            className="w-full"
          >
            <AccordionItem
              value={item.value}
              className={`rounded-xl shadow transition-all duration-300 ${
                openItems[item.value]
                  ? 'bg-blue-100'
                  : 'bg-blue-50 hover:bg-blue-100'
              }`}
            >
              <div
                onClick={() => handleClick(item.value)}
                className="flex w-full cursor-pointer items-center rounded-xl p-4"
              >
                <AccordionTrigger className="w-full text-left text-sm font-semibold text-blue-900">
                  {item.question}
                </AccordionTrigger>
              </div>
              <AccordionContent className="p-4 pt-0 text-left text-xs leading-5 text-blue-800 md:pl-8">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </section>
  )
}
