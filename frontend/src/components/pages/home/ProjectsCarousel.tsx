import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import ProjectCard from '../projects/ProjectCard'
import type { ProjectsResponse } from '@/lib/types/projects'

interface ProjectsCarouselProps {
  projectsResponse?: ProjectsResponse
}

const ProjectsCarousel = ({ projectsResponse }: ProjectsCarouselProps) => {
  const { t } = useTranslation()
  const projects = projectsResponse?.data || []

  if (projects.length === 0) return null

  return (
    <div className="py-8">
      <div className="w-full">
        <div className="flex justify-between items-center px-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            {t('home.projectsTitle')}
          </h1>

          <Link
            to="/projects"
            className="text-sm sm:text-base font-semibold text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap"
          >
            {t('home.seeAll')} →
          </Link>
        </div>

        <Carousel opts={{ align: 'start', loop: true }} className="w-full">
          <CarouselContent className="my-7">
            {projects.map(project => (
              <CarouselItem
                key={project.id}
                className="cursor-default basis-full sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <Link to={`/projects/${project.id}`}>
                  <ProjectCard project={project} />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="md:flex bg-gray-100" />
          <CarouselNext className="md:flex bg-gray-100" />
        </Carousel>
      </div>
    </div>
  )
}

export default ProjectsCarousel
