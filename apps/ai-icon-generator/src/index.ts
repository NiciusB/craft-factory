import Replicate from 'replicate-js'
import fetch from 'node-fetch'
import fs from 'node:fs'
import path, { dirname } from 'node:path'
import dotenv from 'dotenv'
import assert from 'assert'
import { fileURLToPath } from 'node:url'

dotenv.config()

const replicate = new Replicate({ token: process.env.REPLICATE_API_TOKEN })

const currentFileDirectoryPath = dirname(fileURLToPath(import.meta.url))
const outputFolder = path.join(
    currentFileDirectoryPath,
    '..',
    '..',
    'client',
    'src',
    'assets',
    'images',
    'ai-icons'
)

async function main() {
    const source: {
        model: string
        prompt: string
        icons: Array<{
            prompt: string
            filename: string
        }>
    } = JSON.parse(
        fs.readFileSync(path.join(outputFolder, 'source.json'), 'utf-8')
    )
    console.log(`Generating ${source.icons.length} icons`)

    for (let index = 0; index < source.icons.length; index++) {
        const value = source.icons[index]
        const prompt = source.prompt.replaceAll('%%', value.prompt)

        console.log(
            `${index + 1}/${source.icons.length}. Requesting: ${prompt}`
        )

        await downloadPrediction(
            source.model,
            prompt,
            path.join(outputFolder, `${value.filename}.png`)
        )

        console.log(`${index + 1}/${source.icons.length}. Done`)
    }

    console.log(`All done!`)
}
void main()

async function downloadPrediction(
    model: string,
    prompt: string,
    filepath: string
) {
    const image = await predictImage(model, prompt)
    image.pipe(fs.createWriteStream(filepath))
}

async function predictImage(modelName: string, prompt: string) {
    const model = await replicate.models.get(modelName)
    const prediction = await model.predict({
        prompt,
        width: 512,
        height: 512,
        num_outputs: 1,
        num_inference_steps: 100,
        guidance_scale: 7.5,
    })
    if (prediction === null || prediction === undefined) {
        throw new Error(
            'No output from replicate. Possibly due to NSFW detected'
        )
    }
    const imageUrl = prediction[0]

    return await fetch(imageUrl).then((res) => {
        assert(res.body !== null)
        return res.body
    })
}
