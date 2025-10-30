/**
 * @swagger
 * components:
 *  schemas:
 *      User:
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
 *              privateMetadata:
 *                  type: object
 *                  description: Arbitrary private metadata stored for the user (for example role information)
 *                  additionalProperties:
 *                      type: string
 *
 *      Booking:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *              user:
 *                  type: object
 *                  description: Populated user object for this booking
 *                  $ref: '#/components/schemas/User'
 *              show:
 *                  type: object
 *                  description: Populated show object for this booking
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
 *      Show:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *              movie:
 *                  type: object
 *                  description: Populated movie document
 *              showDateTime:
 *                  type: string
 *                  format: date-time
 *              showPrice:
 *                  type: number
 *                  format: float
 *              occupiedSeats:
 *                  type: object
 *                  description: Mapping of seat identifier to user id (only occupied seats present)
 *                  additionalProperties:
 *                      type: string
 *
 *      AdminDashboardData:
 *          type: object
 *          properties:
 *              totalBookings:
 *                  type: integer
 *              totalRevenue:
 *                  type: number
 *                  format: float
 *              activeShows:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/Show'
 *              totalUser:
 *                  type: integer
 *
 *      AdminDashboardResponse:
 *          type: object
 *          properties:
 *              success:
 *                  type: boolean
 *                  example: true
 *              dashboardData:
 *                  $ref: '#/components/schemas/AdminDashboardData'
 *
 *      AdminBookingsResponse:
 *          type: object
 *          properties:
 *              success:
 *                  type: boolean
 *              bookings:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/Booking'
 *
 *      AdminShowsResponse:
 *          type: object
 *          properties:
 *              success:
 *                  type: boolean
 *              shows:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/Show'
 *
 * paths:
 *  /api/admin/is-admin:
 *    get:
 *      summary: Check if the current user is an admin
 *      tags:
 *        - Admins
 *      description: |
 *        Protected endpoint that returns whether the authenticated user has an admin role.
 *        The server enforces admin access by checking the user's role stored in the identity provider (Clerk) private metadata.
 *      responses:
 *        200:
 *          description: User is admin
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: true
 *                  isAdmin:
 *                    type: boolean
 *                    example: true
 *
 *  /api/admin/dashboard:
 *    get:
 *      summary: Get admin dashboard data
 *      tags:
 *        - Admins
 *      description: >
 *        Returns aggregated dashboard data for admin users:
 *        - total number of paid bookings
 *        - total revenue from paid bookings
 *        - list of active upcoming shows (populated with movie)
 *        - total users count
 *        This endpoint is protected and requires the caller to be an admin.
 *      responses:
 *        200:
 *          description: Dashboard data fetched successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/AdminDashboardResponse'
 *
 *  /api/admin/all-shows:
 *    get:
 *      summary: Get all upcoming shows (admin)
 *      tags:
 *        - Admins
 *      description: Returns all upcoming shows (showDateTime greater than or equal to now) with populated movie document. Protected to admin users.
 *      responses:
 *        200:
 *          description: List of shows
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/AdminShowsResponse'
 *
 *  /api/admin/all-bookings:
 *    get:
 *      summary: Get all bookings (admin)
 *      tags:
 *        - Admins
 *      description: Returns all bookings, populated with user and show -> movie. Results are sorted by creation date descending. Protected to admin users.
 *      responses:
 *        200:
 *          description: List of bookings
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/AdminBookingsResponse'
 */