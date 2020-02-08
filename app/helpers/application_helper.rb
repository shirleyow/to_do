module ApplicationHelper
    def user_id
        cookies.encrypted[:user_id]
    end

    def include_id(params)
        params[:user_id] = user_id
        params
    end

    def new_user
        user_id = user_id()
        Task.create(
            title: "Task to be completed!", 
            description: "Something to be done", 
            deadline: 20200510,
            tags: ["first tag","second tag"],
            completed: false,
            important: 0
        )

        Task.create(
            title: "Try adding a task", 
            description: "Depending on the number of days before the task is due, the font colours for the 'Due in ...' statement will be different.", 
            deadline: 20200110,
            tags: ["second tag"],
            completed: false,
            important: 1
        )

        Task.create(
            title: "First completed task!", 
            description: "", 
            deadline: 20200210,
            tags: ["third tag"],
            completed: true,
            important: 0
        )
    end
end
