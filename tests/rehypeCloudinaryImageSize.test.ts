import rehypeParse from "rehype-parse"
import rehypeStringify from "rehype-stringify"
import {unified} from "unified"
import {expect, test, vi} from "vitest"

import {rehypeCloudniaryImage} from "../src/rehypeCloudniaryImage"

const mockFetch = vi.fn()

mockFetch.mockResolvedValue({
    json: () => {
        const response = {output: {width: 100, height: 100}}
        return response
    },
})

global.fetch = mockFetch

test("ignores other elements", async () => {
    const processor = unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeCloudniaryImage)
        .use(rehypeStringify)

    const file = await processor.process("<p>hello world</p>")

    const html = file.toString()
    expect(html).toEqual("<p>hello world</p>")
})

test("ignores image elements with no attributes", async () => {
    const processor = unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeCloudniaryImage)
        .use(rehypeStringify)

    const file = await processor.process("<img>")

    const html = file.toString()
    expect(html).toEqual("<img>")
})

test("ignores image elements with no source attribute", async () => {
    const processor = unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeCloudniaryImage)
        .use(rehypeStringify)

    const file = await processor.process(
        // eslint-disable-next-line quotes
        '<img alt="description">',
    )

    const html = file.toString()

    expect(html).toEqual(
        // eslint-disable-next-line quotes
        '<img alt="description">',
    )
})

test("ignores image elements with non-string source attribute", async () => {
    const processor = unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeCloudniaryImage)
        .use(rehypeStringify)

    const file = await processor.process(
        // eslint-disable-next-line quotes
        '<img src="true">',
    )

    const html = file.toString()

    expect(html).toEqual(
        // eslint-disable-next-line quotes
        '<img src="true">',
    )
})

test("ignores non-cloudinary images", async () => {
    const processor = unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeCloudniaryImage)
        .use(rehypeStringify)

    const file = await processor.process(
        // eslint-disable-next-line quotes
        '<img src="https://example.com/photo.jpg">',
    )

    const html = file.toString()

    expect(html).toEqual(
        // eslint-disable-next-line quotes
        '<img src="https://example.com/photo.jpg">',
    )
})

test("handles one good and one bad image", async () => {
    const processor = unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeCloudniaryImage)
        .use(rehypeStringify)

    const file = await processor.process(
        // eslint-disable-next-line quotes
        '<img src="https://res.cloudinary.com/winterlood/image/upload/v1700021380/blog/oor6bftmbqvqc93argrs.png"><img src="https://example.com/photo.jpg">',
    )

    const html = file.toString()

    expect(html).toEqual(
        // eslint-disable-next-line quotes
        '<img src="https://res.cloudinary.com/winterlood/image/upload/v1700021380/blog/oor6bftmbqvqc93argrs.png" blurDataURL="data:image/webp;base64,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" width="902" height="460"><img src="https://example.com/photo.jpg">',
    )
})

test("handles multiple bad images", async () => {
    const processor = unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeCloudniaryImage)
        .use(rehypeStringify)

    const file = await processor.process(
        // eslint-disable-next-line quotes
        '<img src="https://example.com/photo.jpg"><img alt="description">',
    )

    const html = file.toString()

    expect(html).toEqual(
        // eslint-disable-next-line quotes
        '<img src="https://example.com/photo.jpg"><img alt="description">',
    )
})
