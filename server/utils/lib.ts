import { and, eq } from 'drizzle-orm'
import slugify from 'slugify'
import { uid } from 'uid/secure'
import type {Library, User, Link} from '../database/schema'

class LibService {
  async create(name: string, user: User,isPublic: boolean, id?: string) {
    const slug = await this.createSlug(name)
    const [lib] = await db.insert(tables.library).values({ id: id ?? uid(), name, slug, isPublic, userId: user.id }).returning()
    return lib
  }

  async getLibById(user: User, id: string) {
    const [lib] = await db.select().from(tables.library).where(and(eq(tables.library.id, id), eq(tables.library.userId, user.id)));
    return lib;
  }

  async getLib(user: User, slug: string) {
    const [lib] = await db.select().from(tables.library).where(and(eq(tables.library.slug, slug), eq(tables.library.userId, user.id)))
    return lib
  }

  async createSlug(name: string, withRandom = false): Promise<string> {
    const slug = slugify(name, { lower: true, trim: true }) + (withRandom ? `-${uid(3)}` : '')
    const org = await db.select().from(tables.library).where(eq(tables.library.slug, slug))
    if (org.length)
      return this.createSlug(name, true)
    return slug
  }

  async getLinks(lib: Library) {
    return db.select().from(tables.link)
        .where(eq(tables.link.libraryId, lib.id));
  }
}

export const libService = new LibService()
