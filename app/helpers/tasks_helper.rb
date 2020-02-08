module TasksHelper
    def current_user_tasks
        Task.where(user_id: user_id)
    end
end