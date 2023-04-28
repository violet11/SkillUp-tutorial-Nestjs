import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import express from 'express'
import Logging from 'library/Logging'

import { AppModule } from './modules/app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  })

  // Cors is required, so that api request we are sending from frontend can reach backend
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })
  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser())

  // Setup to display files
  app.use('files', express.static('files'))

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS tutorial API')
    .setDescription('This is API for NestJS tutorial.')
    .setVersion('1.0.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/', app, document)

  const PORT = process.env.PORT || 8080
  await app.listen(PORT)

  Logging.log(`App is listening on: ${await app.getUrl()}`)
}
bootstrap()
