const { server } = require("./socket")
const port = process.env.PORT || 5000

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})