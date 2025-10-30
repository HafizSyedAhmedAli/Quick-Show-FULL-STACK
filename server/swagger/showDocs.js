/**
 * @swagger
 * components:
 *  schemas:
 *      Movie:
 *          type: object
 *          properties:
 *              adult:
 *                  type: boolean
 *              backdrop_path:
 *                  type: string
 *              genre_ids:
 *                  type: array
 *                  items:
 *                      type: integer
 *              id:
 *                  type: integer
 *              original_language:
 *                  type: string
 *              original_title:
 *                  type: string
 *              overview:
 *                  type: string
 *              popularity:
 *                  type: number
 *                  format: float
 *              poster_path:
 *                  type: string
 *              release_date:
 *                  type: string
 *                  format: date
 *                  example: "2025-10-15"
 *              title:
 *                  type: string
 *              video:
 *                  type: boolean
 *              vote_average:
 *                  type: number
 *                  format: float
 *              vote_count:
 *                  type: integer
 * 
 *      Show:
 *          type: object
 *          required: 
 *           - movieId
 *           - showsInput
 *           - showPrice
 *          properties:
 *              movieId:
 *                  type: string
 *              showsInput:
 *                  type: array
 *                  items: 
 *                      type: object
 *                      required:
 *                          - date
 *                          - time
 *                      properties:
 *                          date:
 *                              type: string
 *                              format: date
 *                          time:
 *                              type: array
 *                              items:
 *                                  type: string
 *              showPrice: 
 *                  type: number
 *                  format: float
 * 
 *      Genre:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              name:
 *                  type: string
 * 
 *      Cast:
 *          type: object
 *          properties:
 *              adult:
 *                  type: boolean
 *              gender:
 *                  type: integer
 *              id:
 *                  type: integer
 *              known_for_department:
 *                  type: string
 *              name:
 *                  type: string
 *              original_name:
 *                  type: string
 *              popularity:
 *                  type: number
 *                  format: float
 *              profile_path:
 *                  type: string
 *              cast_id:
 *                  type: integer
 *              character:
 *                  type: string
 *              credit_id:
 *                  type: string
 *              order:
 *                  type: integer
 * 
 *      MovieSummary:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  description: TMDB movie id 
 *              title:
 *                  type: string
 *              overview:
 *                  type: string
 *              poster_path:
 *                  type: string
 *              backdrop_path:
 *                  type: string
 *              release_date:
 *                  type: string
 *                  format: date
 *              original_language:
 *                  type: string
 *              tagline:
 *                  type: string
 *              genres:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/Genre'
 *              casts:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/Cast'
 * 
 *      ShowsListResponse:
 *          type: object
 *          properties:
 *              success:
 *                  type: boolean
 *                  example: true
 *              shows:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/MovieSummary'
 * 
 *      GetShow_DateTimeEntry:
 *       type: object
 *       properties:
 *         time:
 *           type: string
 *           format: date-time
 *         showId:
 *           type: string
 * 
 *      GetShow_DateTimeMap:
 *       type: object
 *       additionalProperties:
 *         type: array
 *         items:
 *           $ref: '#/components/schemas/GetShow_DateTimeEntry'
 * 
 *      GetShowResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         movie:
 *           $ref: '#/components/schemas/MovieSummary'
 *         dateTime:
 *           $ref: '#/components/schemas/GetShow_DateTimeMap'
 * 
 * paths:
 *  /api/show/now-playing:
 *      get:
 *          summary: Get movies currently playing in theaters
 *          tags:
 *              - Shows
 *          description: Fetches the list of movies that are now playing in theaters (data sourced from TMDB).
 *          responses: 
 *              200:
 *                  description: Successful - returns an object with `success` and a `movies` array.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  success:
 *                                      type: boolean
 *                                      example: true
 *                                  movies:
 *                                      type: array
 *                                      items:
 *                                          $ref: '#/components/schemas/Movie'
 *  /api/show/add:
 *      post:
 *          summary:  Add a new show to the database
 *          tags: 
 *              - Shows     
 *          description: Adds one or more showtimes for a movie if the movie doesn't exist in the database then the API creates the movie automatically.
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Show'
 *          responses:
 *              201:
 *                  description: Show(s) Added Successfully
 * 
 *  /api/show/all:
 *    get:
 *      summary: Get all upcoming shows 
 *      tags:
 *        - Shows
 *      description: >
 *        Returns a list of unique movies that have upcoming showtimes.
 *        The API queries shows with `showDateTime >= now`, populates the `movie` field,
 *        sorts by `showDateTime` ascending and returns unique movies.
 *      responses:
 *        200:
 *          description: Successful - returns an object with `success` and `shows` array.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ShowsListResponse'
 *              
 *  /api/show/{movieId}:
 *   get:
 *     summary: Get a single movie and its upcoming shows grouped by date
 *     description: >
 *       Returns the movie document for the given `movieId`
 *       and a `dateTime` object containing upcoming shows (showDateTime >= now) grouped by ISO date (YYYY-MM-DD).
 *       Each date key maps to an array of objects with `time` (ISO date-time) and `showId`.
 *     tags:
 *       - Shows
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Successful response with movie details and grouped upcoming shows
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetShowResponse'
 */