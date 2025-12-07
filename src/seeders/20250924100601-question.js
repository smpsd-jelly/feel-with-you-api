'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('question', [
      {
        // 1 - 12 (status = 1 คำถามหมวดอารมณ์และความสุข (12 ข้อ))
        id: 1,
        question_detail: 'ในสัปดาห์ที่ผ่านมา คุณรู้สึกมีความสุขหรือพอใจกับชีวิตบ่อยแค่ไหน?',
        status: 'GROUP_1',
        created_at: now,
        updated_at: now
      },
      {
        id: 2,
        question_detail: 'คุณรู้สึกสนุกหรือตื่นเต้นกับสิ่งที่ทำในแต่ละวันหรือไม่?',
        status: 'GROUP_1',
        created_at: now,
        updated_at: now
      },
      {
        id: 3,
        question_detail: 'คุณรู้สึกพอใจกับตัวเองหรือไม่?',
        status: 'GROUP_1',
        created_at: now,
        updated_at: now
      },
      {
        id: 4,
        question_detail: 'คุณรู้สึกว่าชีวิตของคุณมีเป้าหมายหรือไม่?',
        status: 'GROUP_1',
        created_at: now,
        updated_at: now
      },
      {
        id: 5,
        question_detail: 'คุณรู้สึกผ่อนคลายบ่อยครั้งหรือไม่?',
        status: 'GROUP_1',
        created_at: now,
        updated_at: now
      },
      {
        id: 6,
        question_detail: 'คุณรู้สึกว่าชีวิตของคุณมีค่าหรือไม่?',
        status: 'GROUP_1',
        created_at: now,
        updated_at: now
      },
      {
        id: 7,
        question_detail: 'คุณรู้สึกมั่นใจในตัวเองหรือไม่?',
        status: 'GROUP_1',
        created_at: now,
        updated_at: now
      },
      {
        id: 8,
        question_detail: 'คุณรู้สึกขอบคุณสิ่งเล็ก ๆ น้อย ๆ รอบตัวหรือไม่?',
        status: 'GROUP_1',
        created_at: now,
        updated_at: now
      },
      {
        id: 9,
        question_detail: 'คุณหัวเราะหรือยิ้มได้ง่ายหรือไม่?',
        status: 'GROUP_1',
        created_at: now,
        updated_at: now
      },
      {
        id: 10,
        question_detail: 'คุณรู้สึกมองโลกในแง่ดีหรือไม่?',
        status: 'GROUP_1',
        created_at: now,
        updated_at: now
      },
      {
        id: 11,
        question_detail: 'คุณรู้สึกว่าแต่ละวันมีเรื่องดี ๆ เกิดขึ้นกับคุณหรือไม่?',
        status: 'GROUP_1',
        created_at: now,
        updated_at: now
      },
      {
        id: 12,
        question_detail: 'คุณรู้สึกเชื่อมั่นในความสามารถของตนเองหรือไม่?',
        status: 'GROUP_1',
        created_at: now,
        updated_at: now
      },

      // 13 - 26 (the new set, status = 2 คำถามหมวดความเครียดและความกังวล (12 ข้อ))
      {
        id: 13,
        question_detail: 'ในช่วงสัปดาห์ที่ผ่านมา คุณรู้สึกเครียดมากเกินไปหรือไม่?',
        status: 'GROUP_2',
        created_at: now,
        updated_at: now
      },
      {
        id: 14,
        question_detail: 'คุณรู้สึกกังวลกับเรื่องเล็กน้อยหรือไม่?',
        status: 'GROUP_2',
        created_at: now,
        updated_at: now
      },
      {
        id: 15,
        question_detail: 'คุณรู้สึกกังวลกับเรื่องเล็กน้อยหรือไม่?',
        status: 'GROUP_2',
        created_at: now,
        updated_at: now
      },
      {
        id: 16,
        question_detail: 'คุณมีอาการใจสั่น หายใจเร็ว หรือรู้สึกประหม่าอย่างเห็นได้ชัดหรือไม่?',
        status: 'GROUP_2',
        created_at: now,
        updated_at: now
      },
      {
        id: 17,
        question_detail: 'คุณรู้สึกกังวลจนรบกวนการนอนหรือไม่?',
        status: 'GROUP_2',
        created_at: now,
        updated_at: now
      },
      {
        id: 18,
        question_detail: 'คุณรู้สึกกดดันจากงานหรือการเรียนหรือไม่?',
        status: 'GROUP_2',
        created_at: now,
        updated_at: now
      },
      {
        id: 19,
        question_detail: 'คุณรู้สึกหงุดหงิดง่ายหรือไม่?',
        status: 'GROUP_2',
        created_at: now,
        updated_at: now
      },
      {
        id: 20,
        question_detail: 'คุณรู้สึกว่าต้องทำทุกอย่างให้สมบูรณ์แบบหรือไม่?',
        status: 'GROUP_2',
        created_at: now,
        updated_at: now
      },
      {
        id: 21,
        question_detail: 'คุณรู้สึกกังวลแม้กับสิ่งที่ยังไม่เกิดขึ้นหรือไม่?',
        status: 'GROUP_2',
        created_at: now,
        updated_at: now
      },
      {
        id: 22,
        question_detail: 'คุณรู้สึกเหนื่อยล้าจากความคิดมากเกินไปหรือไม่?',
        status: 'GROUP_2',
        created_at: now,
        updated_at: now
      },
      {
        id: 23,
        question_detail: 'คุณรู้สึกกังวลว่าอาจทำผิดพลาดอยู่เสมอหรือไม่?',
        status: 'GROUP_2',
        created_at: now,
        updated_at: now
      },
      {
        id: 24,
        question_detail: 'คุณรู้สึกว่าความกังวลทำให้ความสัมพันธ์กับผู้อื่นแย่ลงหรือไม่?',
        status: 'GROUP_2',
        created_at: now,
        updated_at: now
      },
      // 25 - 38 (the new set, status = 3 คำถามหมวดภาวะซึมเศร้า (14 ข้อ))
      {
        id: 25,
        question_detail: 'ในช่วงสัปดาห์ที่ผ่านมา คุณรู้สึกเศร้าส่วนใหญ่ของวันหรือไม่?',
        status: 'GROUP_3',
        created_at: now,
        updated_at: now
      },
      {
        id: 26,
        question_detail: 'คุณรู้สึกไม่อยากทำกิจกรรมที่เคยชอบหรือไม่?',
        status: 'GROUP_3',
        created_at: now,
        updated_at: now
      },
      {
        id: 27,
        question_detail: 'คุณรู้สึกผิดหรือโทษตัวเองบ่อยหรือไม่?',
        status: 'GROUP_3',
        created_at: now,
        updated_at: now
      },
      {
        id: 28,
        question_detail: 'คุณร้องไห้หรืออยากร้องไห้บ่อยหรือไม่?',
        status: 'GROUP_3',
        created_at: now,
        updated_at: now
      },
      {
        id: 29,
        question_detail: 'คุณรู้สึกอยากแยกตัวออกจากคนอื่นหรือไม่?',
        status: 'GROUP_3',
        created_at: now,
        updated_at: now
      },
      {
        id: 30,
        question_detail: 'คุณรู้สึกอยากแยกตัวออกจากคนอื่นหรือไม่?',
        status: 'GROUP_3',
        created_at: now,
        updated_at: now
      },
      {
        id: 31,
        question_detail: 'คุณรู้สึกเหนื่อยง่ายแม้ทำสิ่งเล็กน้อยหรือไม่?',
        status: 'GROUP_3',
        created_at: now,
        updated_at: now
      },
      {
        id: 32,
        question_detail: 'คุณรู้สึกเบื่อหน่ายกับทุกสิ่งหรือไม่?',
        status: 'GROUP_3',
        created_at: now,
        updated_at: now
      },
      {
        id: 33,
        question_detail: 'คุณรู้สึกว่าชีวิตเต็มไปด้วยความล้มเหลวหรือไม่?',
        status: 'GROUP_3',
        created_at: now,
        updated_at: now
      },
      {
        id: 34,
        question_detail: 'คุณรู้สึกว่าตัวเองไม่ดีพอหรือไม่?',
        status: 'GROUP_3',
        created_at: now,
        updated_at: now
      },
      {
        id: 35,
        question_detail: 'คุณรู้สึกว่าความเศร้าอยู่กับคุณเกือบทั้งวันหรือไม่?',
        status: 'GROUP_3',
        created_at: now,
        updated_at: now
      },
      {
        id: 36,
        question_detail: 'คุณรู้สึกเบื่ออาหารหรือกินมากกว่าปกติหรือไม่?',
        status: 'GROUP_3',
        created_at: now,
        updated_at: now
      },
      {
        id: 37,
        question_detail: 'คุณรู้สึกช้าลงหรือทำสิ่งต่าง ๆ ได้ยากกว่าปกติหรือไม่?',
        status: 'GROUP_3',
        created_at: now,
        updated_at: now
      },
      {
        id: 38,
        question_detail: 'คุณรู้สึกไม่อยากพบเจอผู้คนแม้เป็นคนใกล้ชิดหรือไม่?',
        status: 'GROUP_3',
        created_at: now,
        updated_at: now
      },

      // 39 - 50 (the new set, status = 4 คำถามหมวดการนอนและพลังงาน (12 ข้อ))
      {
        id: 39,
        question_detail: 'ในช่วงสัปดาห์ที่ผ่านมา คุณนอนหลับยากหรือไม่?',
        status: 'GROUP_4',
        created_at: now,
        updated_at: now
      },
      {
        id: 40,
        question_detail: 'คุณตื่นกลางดึกบ่อยครั้งหรือไม่?',
        status: 'GROUP_4',
        created_at: now,
        updated_at: now
      },
      {
        id: 41,
        question_detail: 'คุณตื่นเช้าเกินไปและนอนต่อไม่ได้หรือไม่?',
        status: 'GROUP_4',
        created_at: now,
        updated_at: now
      },
      {
        id: 42,
        question_detail: 'คุณฝันร้ายหรือสะดุ้งตื่นบ่อยหรือไม่?',
        status: 'GROUP_4',
        created_at: now,
        updated_at: now
      },
      {
        id: 43,
        question_detail: 'คุณรู้สึกว่านอนหลับไม่เพียงพอหรือไม่?',
        status: 'GROUP_4',
        created_at: now,
        updated_at: now
      },
      {
        id: 44,
        question_detail: 'คุณรู้สึกง่วงนอนระหว่างวันหรือไม่?',
        status: 'GROUP_4',
        created_at: now,
        updated_at: now
      },
      {
        id: 45,
        question_detail: 'คุณรู้สึกว่าการนอนไม่ช่วยฟื้นฟูร่างกายหรือไม่?',
        status: 'GROUP_4',
        created_at: now,
        updated_at: now
      },
      {
        id: 46,
        question_detail: 'คุณขาดสมาธิเพราะพักผ่อนไม่พอหรือไม่?',
        status: 'GROUP_4',
        created_at: now,
        updated_at: now
      },
      {
        id: 47,
        question_detail: 'คุณรู้สึกว่าคุณภาพการนอนของคุณไม่ดีหรือไม่?',
        status: 'GROUP_4',
        created_at: now,
        updated_at: now
      },
      {
        id: 48,
        question_detail: 'คุณต้องพึ่งคาเฟอีนหรือเครื่องดื่มกระตุ้นหรือไม่?',
        status: 'GROUP_4',
        created_at: now,
        updated_at: now
      },
      {
        id: 49,
        question_detail: 'คุณรู้สึกไม่มีแรงทำกิจกรรมที่เคยทำได้ตามปกติหรือไม่?',
        status: 'GROUP_4',
        created_at: now,
        updated_at: now
      },
      {
        id: 50,
        question_detail: 'คุณรู้สึกตื่นนอนแล้วไม่สดชื่นแม้จะนอนครบชั่วโมงหรือไม่?',
        status: 'GROUP_4',
        created_at: now,
        updated_at: now
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('question', {
      id: Array.from({ length: 25 }, (_, i) => i + 1)
    }, {});
  }
};
