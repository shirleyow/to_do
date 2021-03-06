class ApplicationController < ActionController::Base
    before_action :check_user_id_presence

    private
    def check_user_id_presence
        if cookies.encrypted.permanent[:user_id].nil?
            cookies.encrypted.permanent[:user_id] = SecureRandom.hex
            helpers.new_user
        end
    end
end
