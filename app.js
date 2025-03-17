import mysql from 'mysql2';

const app = express()

app.use(cors())
app.use(express())

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})