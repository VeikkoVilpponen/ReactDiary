import { readFile, writeFile } from 'fs/promises'; 
import path from 'path';

export interface User {
    userId: number,
    username: string,
    password: string
}

class Users {

    private filename: string[] = [__dirname, "data", "users.json"];
    private data: User[] = [];

    constructor() {

        readFile(path.resolve(...this.filename), "utf-8")
            .then((dataStr: string) => {
                this.data = JSON.parse(dataStr);
            })
            .catch((e: any) => {
                this.data = [];
            });

    }

    public getUser = async (username: string): Promise<any> => {

        return this.data.find((user: User) => {
            return user.username === username;
        });

    }

}

export default new Users();