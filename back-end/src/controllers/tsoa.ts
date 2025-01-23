import { Controller, Post, Route, Tags, Body, Get, Put, Delete, Response, SuccessResponse, Path, Query } from 'tsoa';
import { CreateCustomer } from './../types/Customer'
import { QueryBook, CreateBook, UpdateBook } from './../types/Book'

type ID = { id: string }

@Route('api')
@Tags('Sample Api')
export class SampleController extends Controller {
  /**
   * Registration
   * @summary Registration
   * @param requestBody
   */
  @Response(400, "Bad Request")
  @SuccessResponse("201", "Created")
  @Post('registration')
  public async register(
    @Body() requestBody: CreateCustomer
  ): Promise<void> {
    this.setStatus(400);
    this.setStatus(201);
  }

  /**
   * Get books
   * @summary Get books
   */
  @Get('books')
  public async getBooks(
    @Query() search?: string
  ): Promise<QueryBook[]> {
    this.setStatus(200);
    return []
  }

  /**
   * Create Book
   * @summary Create Book
   * @param requestBody
   */
  @Response(500, "Server")
  @Response(400, "Bad Request")
  @SuccessResponse("201", "Created")
  @Post('books')
  public async createBook(
    @Body() requestBody: CreateBook
  ): Promise<QueryBook> {
    this.setStatus(500);
    this.setStatus(400);
    this.setStatus(201);
    return {} as QueryBook
  }

  /**
   * Get book
   * @summary Get book
   * @param id The user's identifier
   */
  @Response(400, "Bad Request")
  @Get('book/{id}')
  public async getBook(
    @Path() id: string
  ): Promise<QueryBook> {
    this.setStatus(400);
    return {} as QueryBook
  }

  /**
   * Delete book
   * @summary Delete book
   * @param id The user's identifier
   */
  @SuccessResponse("200", "Success")
  @Delete('book/{id}')
  public async deleteBook(
    @Path() id: string
  ): Promise<void> {
    this.setStatus(200);
  }

  /**
   * Update Book
   * @summary Update Book
   * @param requestBody
   */
  @Response(500, "Server")
  @Response(400, "Bad Request")
  @SuccessResponse(200, "Updated")
  @Put('book/{id}')
  public async updateBook(
    @Path() id: string,
    @Body() requestBody: UpdateBook
  ): Promise<QueryBook> {
    this.setStatus(500);
    this.setStatus(400);
    this.setStatus(200);
    return {} as QueryBook
  }

  /**
   * In the parameters array you need to specify the book IDs
   * @summary Get Books from Customer's List by IDs
   * @param requestBody
   */
  @Post('books-list')
  public async getBooksByIds(
    @Body() requestBody: {list: string[] | undefined}
  ): Promise<QueryBook[] | undefined> {
    return []
  }

  /**
   * Add Book to Customer's List
   * @summary Add Book to Customer's List
   * @param id The user's identifier
   */
  @Response(400, "Bad Request")
  @SuccessResponse(201, "Updated")
  @Get('wish-list/{id}')
  public async getWishList(
    @Path() id: string
  ): Promise<void> {
    this.setStatus(400);
    this.setStatus(201);
  }
}