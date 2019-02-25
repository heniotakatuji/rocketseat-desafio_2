const { User, Appointment } = require('../models')
const { Op } = require('sequelize')

const data = require('moment')

class DashboardController {
  async index (req, res) {
    // Lista providers
    const providers = await User.findAll({ where: { provider: true } })

    // Lista agendamentos
    const { id } = req.session.user

    User.hasMany(Appointment, { foreignKey: 'user_id' })
    Appointment.belongsTo(User, { foreignKey: 'user_id' })

    const appointments = await Appointment.findAll({
      include: [
        {
          model: User
        }
      ],
      where: {
        [Op.and]: [{ provider_id: id }]
      },
      order: [['date']]
    })

    const moment = data

    return res.render('dashboard', { providers, appointments, moment })
  }
}

module.exports = new DashboardController()
