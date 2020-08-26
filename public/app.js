const app = new Vue ({
    el: '#app',
    data: {
        switchLabel: 'I already have a username',
        user_creation: true,
        new_user: '',
        add_exercise: false,
        username: '',
        description: '',
        duration: 0,
        status: '',
        date: ''
    },
    methods: {
        windowSwitch() {
            this.status = '';
            this.user_creation = !this.user_creation;
            this.add_exercise = !this.add_exercise;
            this.switchLabel = this.user_creation === false ? 'I don\'t have a username yet.':'I already have a username';
        },
        async newUserPOST() {
            const form = document.getElementById('user_creation');
            const response = await fetch('/api/exercise/new-user', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.new_user,
                }),
            });
            form.reset();
            if(response.ok) {
                this.status = 'user created successfully 🙂';
            } else if (response.status === 409){
                this.status = 'username already taken 😢';
            };
        },
        async newExercisePOST() {
            const form = document.getElementById('add_exercise');
            const response = await fetch('/api/exercise/add', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.username,
                    description: this.description,
                    duration_mins: this.duration,
                    date: this.date,
                }),
            });
            form.reset();
            if(response.ok) {
                this.status = 'exercise added successfully 🙂';
            } else if (response.status === 409){
                this.status = 'user does not exist 😢';
            };
        }
    }
});

