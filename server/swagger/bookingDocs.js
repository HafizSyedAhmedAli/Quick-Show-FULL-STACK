/**
 * @swagger
 * components:
 *  schemas:
 *      BookingCreateRequest:
 *          type: object
 *          required:
 *            - showId
 *            - selectedSeats
 *          properties:
 *              showId:
 *                  type: string
 *                  example: "6543ab12cdef34567890abcd"
 *              selectedSeats:
 *                  type: array
 *                  items:
 *                      type: string
 *                      example: "A1"
 *
 *      OccupiedSeatsResponse:
 *          type: object
 *          properties:
 *              success:
 *                  type: boolean
 *                  example: true
 *              occupiedSeats:
 *                  type: array
 *                  items:
 *                      type: string
 *                  description: Array of seat identifiers that are currently occupied for the show
 *                  example: ["A1","A2","B3"]
 *
 * paths:
 *  /api/booking/create:
 *    post:
 *      summary: Create a booking
 *      tags:
 *        - Bookings
 *      description: >
 *        Creates a booking for the provided `showId` and `selectedSeats`.
 *        - Verifies seat availability.
 *        - Creates a Booking document and marks the seats as occupied on the Show document.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/BookingCreateRequest'
 *      responses:
 *        200:
 *          description: Booking created successfully or seat unavailable message
 *          
 *  /api/booking/seats/{showId}:
 *    get:
 *      summary: Get occupied seats for a show
 *      tags:
 *        - Bookings
 *      description: Returns the list of currently occupied seat identifiers for the specified show.
 *      parameters:
 *        - in: path
 *          name: showId
 *          required: true
 *          schema:
 *            type: string
 *          description: Show id to fetch occupied seats
 *      responses:
 *        200:
 *          description: Successful - returns an object with `success` and `occupiedSeats` array.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/OccupiedSeatsResponse'
 *        
 */
