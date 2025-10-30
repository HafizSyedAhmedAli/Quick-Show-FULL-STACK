/**
 * @swagger
 * components:
 *  schemas:
 *      UserSummary:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  description: User document id
 *              email:
 *                  type: string
 *                  format: email
 *              firstName:
 *                  type: string
 *              lastName:
 *                  type: string
 *
 *      MovieSummary:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  description: Movie document id
 *              title:
 *                  type: string
 *              poster_path:
 *                  type: string
 *              release_date:
 *                  type: string
 *                  format: date
 *
 *      ShowSummary:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *              movie:
 *                  $ref: '#/components/schemas/MovieSummary'
 *              showDateTime:
 *                  type: string
 *                  format: date-time
 *              showPrice:
 *                  type: number
 *                  format: float
 *
 *      BookingSummary:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  description: Booking document id
 *              user:
 *                  $ref: '#/components/schemas/UserSummary'
 *              show:
 *                  $ref: '#/components/schemas/ShowSummary'
 *              amount:
 *                  type: number
 *                  format: float
 *              bookedSeats:
 *                  type: array
 *                  items:
 *                      type: string
 *              isPaid:
 *                  type: boolean
 *              createdAt:
 *                  type: string
 *                  format: date-time
 *
 *      GetUserBookingsResponse:
 *          type: object
 *          properties:
 *              success:
 *                  type: boolean
 *                  example: true
 *              bookings:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/BookingSummary'
 *
 *      FavoriteRequest:
 *          type: object
 *          required:
 *            - movieId
 *          properties:
 *              movieId:
 *                  type: string
 *                  description: Id of the movie to toggle in user's favorites
 *                  example: "634b1f2a1234abcd5678ef90"
 *
 *      MessageResponse:
 *          type: object
 *          properties:
 *              success:
 *                  type: boolean
 *              message:
 *                  type: string
 *
 *      FavoritesResponse:
 *          type: object
 *          properties:
 *              success:
 *                  type: boolean
 *              movies:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/MovieSummary'
 *
 *
 * paths:
 *  /api/user/bookings:
 *    get:
 *      summary: Get current user's bookings
 *      tags:
 *        - Users
 *      description: Returns bookings for the authenticated user. Each booking includes populated show and movie documents.
 *      responses:
 *        200:
 *          description: Successful — returns the user's bookings sorted by newest first.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/GetUserBookingsResponse'
 *
 *  /api/user/my-favorite:
 *    post:
 *      summary: Toggle a movie in the authenticated user's favorites
 *      tags:
 *        - Users
 *      description: |
 *        Adds the provided `movieId` to the user's private favorites metadata if not present.
 *        If the movie is already present it will be removed (toggle behavior).
 *        This endpoint updates the user's private metadata in the identity provider (Clerk).
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/FavoriteRequest'
 *      responses:
 *        200:
 *          description: Favorite updated
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/MessageResponse'
 *
 *  /api/user/favorites:
 *    get:
 *      summary: Get authenticated user's favorite movies
 *      tags:
 *        - Users
 *      description: Returns the list of movies marked as favorites by the authenticated user. Movies are fetched from the local Movie collection using the ids stored in the user's private metadata.
 *      responses:
 *        200:
 *          description: Successful — returns an array of MovieSummary objects.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/FavoritesResponse'
 */
