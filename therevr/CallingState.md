//
henry, kareem online

henry calls kareem

henry enters call
	-> create room
		{
			users: [henry, kareem],
			activeUsers: [henry],
			rejectedUsers: []
		}
	-> push notification

* kareem accepts call
	-> enter room
		{
			users: [henry, kareem],
			activeUsers: [henry, kareem]
			rejectedUsers: []
		}
* kareem rejects call
	{
		users: [henry, kareem],
		activeUsers: [henry],
		rejectedUsers: [kareem]
	}

FRONT END

if (users.length - rejectedUsers.length == 1) {
	Call Rejected
} else if (activeUsers.length == 1) {
	Calling
} else {
	In Call
	[User list (Rejected ?)]
}
