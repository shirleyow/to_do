class Task < ApplicationRecord
	validates :title, :user_id, presence: true
end
