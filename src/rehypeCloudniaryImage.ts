import {Properties} from "hast"
import {Element, isElement} from "hast-util-is-element"
import {CONTINUE, Node, SKIP, visit} from "unist-util-visit"

import {
    getBlurImage,
    getImageDimensions,
    isCloudinaryImage,
} from "./cloudinary.js"

interface Image extends Element {
    properties: Properties
}

const rehypeCloudniaryImage = () => {
    const images: Image[] = []

    const visitor = (node: Element) => {
        if (
            isElement(node, "img") &&
            node.properties !== undefined &&
            typeof node.properties.src === "string" &&
            isCloudinaryImage(node.properties.src)
        ) {
            images.push(node as Image)
            return SKIP
        }

        return CONTINUE
    }

    const transformer = async (tree: Node) => {
        visit(tree, "element", visitor)

        const dimensionPromises = images.map(image => {
            return getImageDimensions(image.properties?.src as string)
        })

        const dimensions = await Promise.all(dimensionPromises)

        const blurPromises = images.map(image => {
            return getBlurImage(image.properties?.src as string)
        })

        const blurImages = await Promise.all(blurPromises)

        images.forEach((image, index) => {
            const dimension = dimensions[index]
            const blurImage = blurImages[index]

            image.properties.blurDataURL = blurImage
            image.properties.width = dimension.width
            image.properties.height = dimension.height
        })
    }

    return transformer
}

export {rehypeCloudniaryImage}
