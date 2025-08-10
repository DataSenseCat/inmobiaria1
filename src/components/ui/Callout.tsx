import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from './button'
import { Card, CardContent } from './card'
import { cn } from '../../lib/utils'

interface CalloutProps {
  title?: string
  description?: string
  buttonText?: string
  buttonLink?: string
  variant?: 'default' | 'secondary' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  centered?: boolean
  className?: string
}

export default function Callout({
  title = '¿Necesitas Ayuda?',
  description = 'Nuestro equipo está listo para ayudarte a encontrar la propiedad perfecta.',
  buttonText = 'Contactanos',
  buttonLink = '/contacto',
  variant = 'default',
  size = 'md',
  centered = true,
  className
}: CalloutProps) {
  const variantStyles = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    accent: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
  }

  const sizeStyles = {
    sm: 'py-8 px-6',
    md: 'py-12 px-8',
    lg: 'py-16 px-10'
  }

  const textSizes = {
    sm: {
      title: 'text-xl md:text-2xl',
      description: 'text-sm md:text-base',
      button: 'default'
    },
    md: {
      title: 'text-2xl md:text-3xl',
      description: 'text-base md:text-lg',
      button: 'lg'
    },
    lg: {
      title: 'text-3xl md:text-4xl',
      description: 'text-lg md:text-xl',
      button: 'lg'
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={cn('w-full', className)}
    >
      <div className="container mx-auto px-4">
        <Card className={cn(
          'rounded-2xl border-0 shadow-2xl overflow-hidden',
          variantStyles[variant]
        )}>
          <CardContent className={cn(
            'relative',
            sizeStyles[size],
            centered ? 'text-center' : 'text-left'
          )}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div 
                className="absolute inset-0" 
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 70% 20%, white 1px, transparent 1px)`,
                  backgroundSize: '50px 50px'
                }}
              />
            </div>

            <div className={cn(
              'relative z-10 space-y-6',
              centered ? 'max-w-2xl mx-auto' : 'max-w-4xl'
            )}>
              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className={cn(
                  'font-bold leading-tight',
                  textSizes[size].title
                )}
              >
                {title}
              </motion.h2>

              {/* Description */}
              {description && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className={cn(
                    'opacity-90 leading-relaxed',
                    textSizes[size].description
                  )}
                >
                  {description}
                </motion.p>
              )}

              {/* Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className={centered ? 'flex justify-center' : ''}
              >
                <Button
                  asChild
                  variant={variant === 'default' ? 'secondary' : 'default'}
                  size={textSizes[size].button as 'default' | 'lg'}
                  className={cn(
                    'rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300',
                    variant === 'default' && 'bg-white text-primary hover:bg-gray-100',
                    (variant === 'secondary' || variant === 'accent') && 'bg-white text-gray-900 hover:bg-gray-100'
                  )}
                >
                  <Link to={buttonLink}>
                    {buttonText}
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/10 blur-xl" />
            <div className="absolute bottom-4 left-4 w-32 h-32 rounded-full bg-white/5 blur-2xl" />
          </CardContent>
        </Card>
      </div>
    </motion.section>
  )
}
