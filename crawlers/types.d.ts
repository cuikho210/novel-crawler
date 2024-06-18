
export interface Chapter {
	index: number
	title: string
	content: string
}

export interface Book {
	name: string
	slug: string
	author: string
	chapters: Chapter[]
}
