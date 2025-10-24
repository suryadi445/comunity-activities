const path = process.env.FILE_UPLOAD_PATH || null;

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    await knex('landing_page_contents').del();

    await knex.raw("ALTER SEQUENCE landing_page_contents_id_seq RESTART WITH 1");

    const user = await knex('users').select('id').first();
    const userId = user.id;
    const now = new Date();
    const defaultActivityList = [
        "Kerja Bakti Bersama",
        "Rapat Rutin Bulanan",
        "Perayaan HUT Kemerdekaan",
        "Acara Silahturahmi Warga",
        "Donasi Bantuan Bencana",
    ].map((title, index) => {
        const activityDate = new Date(now);
        activityDate.setDate(activityDate.getDate() + (index * 7));
        return {
            title,
            activity_date: activityDate.toISOString().split('T')[0], // yyyy-mm-dd
            time: "1" + index + ":00",
            location: [
                "Lapangan RW",
                "Balai Pertemuan",
                "Kantor Kelurahan",
                "Posyandu",
                "Taman Lingkungan",
            ][index % 5],
        };
    });

    const transactionData = [
        { date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 40).toISOString().split('T')[0], description: 'Iuran Bulanan', category: "Infaq", amount: '+ Rp 50.000', type: 'in' },
        { date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 35).toISOString().split('T')[0], description: 'Pembelian ATK', category: "Operasional", amount: '- Rp 25.000', type: 'out' },
        { date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 28).toISOString().split('T')[0], description: 'Donasi Kegiatan', category: "Infaq", amount: '+ Rp 100.000', type: 'in' },
        { date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 21).toISOString().split('T')[0], description: 'Pembayaran Listrik', category: "Utilitas", amount: '- Rp 75.000', type: 'out' },
        { date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14).toISOString().split('T')[0], description: 'Sumbangan Kebersihan', category: "Infaq", amount: '+ Rp 20.000', type: 'in' },
        { date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString().split('T')[0], description: 'Pembelian Sembako', category: "Operasional", amount: '- Rp 15.000', type: 'out' },
    ];

    const galleryImages = [
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1740&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1515168833906-d2a3b82b302a?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1499955085172-a104c9463ece?q=80&w=1740&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1740&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1740&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1740&auto=format&fit=crop",
    ];

    const announcements = [
        {
            category: "Kesehatan",
            title: "Pemeriksaan Kesehatan Gratis",
            content: "Event Puskesmas untuk warga RW.",
            start_date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10),
            start_time: "09:00",
            end_date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10),
            end_time: "12:00",
            image: null,
            is_active: true,
        },
        {
            category: "Lingkungan",
            title: "Kerja Bakti Mingguan",
            content: "Ayo ikut kerja bakti hari Minggu!",
            start_date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2),
            start_time: "07:00",
            end_date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2),
            end_time: "10:00",
            image: null,
            is_active: true,
        },
        {
            category: "Keuangan",
            title: "Pengumpulan Iuran Bulanan",
            content: "Iuran bulan ini dikumpulkan sampai tanggal 25.",
            start_date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5),
            start_time: "08:00",
            end_date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5),
            end_time: "17:00",
            image: null,
            is_active: true,
        },
        {
            category: "Umum",
            title: "Rapat Warga",
            content: "Rapat warga bulanan di Balai RW.",
            start_date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
            start_time: "19:00",
            end_date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
            end_time: "21:00",
            image: null,
            is_active: false,
        },
        {
            category: "Pendidikan",
            title: "Bazar Buku Anak",
            content: "Bazar buku murah untuk anak-anak.",
            start_date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14),
            start_time: "08:00",
            end_date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14),
            end_time: "12:00",
            image: null,
            is_active: true,
        },
    ];

    const address = [
        {
            address: "Jl. H. Gadung No. 20, Pondok Ranji, Ciputat Timur, Tangerang Selatan, Banten",
            phone: '0896784686451',
            email: 'suryadi.hhb@gmail.com',
        }
    ]

    const defaultContents = [
        {
            type: 'slideshow',
            user_id: userId,
            header: 'Bersama Membangun Komunitas yang Kuat',
            title: 'Menghubungkan warga, menggerakkan aksi, membangun masa depan.',
            path: path,
            image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=1740&auto=format&fit=crop',
        },
        {
            type: 'slideshow',
            user_id: userId,
            header: 'Gotong Royong untuk Semua',
            title: 'Setiap tangan membantu, setiap hati peduli.',
            path: path,
            image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1740&auto=format&fit=crop',
        },
        {
            type: 'slideshow',
            user_id: userId,
            header: 'Transparansi Adalah Kunci',
            title: 'Keuangan warga yang terbuka dan terpercaya.',
            path: path,
            image: 'https://images.unsplash.com/photo-1515168833906-d2a3b82b302a?q=80&w=1740&auto=format&fit=crop',
        },
        {
            type: 'slideshow',
            user_id: userId,
            header: 'Kegiatan Sosial dan Kebersamaan',
            title: 'Berbagi dan peduli sesama dalam berbagai acara komunitas.',
            path: path,
            image: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?q=80&w=1740&auto=format&fit=crop',
        },
        {
            type: 'slideshow',
            user_id: userId,
            header: 'Lingkungan yang Bersih dan Asri',
            title: 'Kerja bersama menjaga kebersihan dan keindahan lingkungan.',
            path: path,
            image: 'https://images.unsplash.com/photo-1468071174046-657d9d351a40?q=80&w=1740&auto=format&fit=crop',
        },

        // About Us
        {
            type: 'about_us',
            user_id: userId,
            vision_mission: 'Menjadi wadah yang mendorong kolaborasi, kepedulian, dan keberlanjutan demi menciptakan masyarakat yang sejahtera dan harmonis. Kami berkomitmen untuk terus berkembang bersama, berbagi manfaat, serta memberikan kontribusi positif bagi generasi mendatang.',
            principle: JSON.stringify([
                {
                    icon: 'HiOutlineSparkles',
                    color: 'text-yellow-500',
                    text: "Selalu transparan dan dapat dipercaya.",
                },
                {
                    icon: 'HiOutlineSparkles',
                    color: 'text-yellow-500',
                    text: "Bekerja bersama dengan semangat kebersamaan.",
                },
                {
                    icon: 'HiOutlineSparkles',
                    color: 'text-yellow-500',
                    text: "Menjaga lingkungan untuk masa depan.",
                },
                {
                    icon: 'HiOutlineSparkles',
                    color: 'text-yellow-500',
                    text: "Terbuka dan merangkul semua orang.",
                },
                {
                    icon: 'HiOutlineSparkles',
                    color: 'text-yellow-500',
                    text: "Memberikan yang terbaik dengan kualitas tinggi.",
                }
            ]),
            description: 'Kami hadir sebagai komunitas yang peduli, dan berorientasi pada kemajuan bersama. Dengan semangat kolaborasi, kami mengembangkan program dan kegiatan yang memberi manfaat nyata serta mendukung pembangunan sosial yang berkelanjutan.',
        },

        // Transaction
        {
            type: 'transaction',
            user_id: userId,
            description: 'Laporan keuangan transparan dan akurat, dapat diakses oleh semua warga. Setiap pemasukan dan pengeluaran dicatat dengan detail.',
        },

        // Footer
        {
            type: 'footer',
            user_id: userId,
            latitude: '-6.285978',
            longitude: '106.739318',
            footer: 'Hak Cipta © 2025 Milik Suryadi. Semua Hak Dilindungi.',
            path: path,
            description: '“Jika anak Adam meninggal, terputuslah amalnya kecuali dari yang tiga; Sedekah jariyah, ilmu yang bermanfaat, atau anak saleh yang mendoakan.” (HR. Muslim, no. 1631)',
            image: 'https://images.unsplash.com/photo-1515168833906-d2a3b82b302a?q=80&w=1740&auto=format&fit=crop',
        },

        // Structure
        {
            type: 'structure',
            user_id: userId,
            leader_title: 'Ketua RT',
            leader_name: 'Suryadi',
            leader_phone: '089678468651',
            image: '../../../images/user.jpg',
            assistant_title: '',
            assistant_name: '',
            assistant_phone: '',
        },

        {
            type: 'structure',
            user_id: userId,
            leader_title: '',
            leader_name: '',
            leader_phone: '',
            assistant_title: 'Sekretaris 1',
            assistant_name: 'Ronaldo',
            assistant_phone: '08123456789',
            image: '../../../images/user3.png'
        },

        {
            type: 'structure',
            user_id: userId,
            leader_title: '',
            leader_name: '',
            leader_phone: '',
            assistant_title: 'Sekretaris 2',
            assistant_name: 'Messi',
            assistant_phone: '08123456789',
            image: '../../../images/user2.png',
        },

        {
            type: 'structure',
            user_id: userId,
            leader_title: '',
            leader_name: '',
            leader_phone: '',
            assistant_title: 'Bendahara',
            assistant_name: 'Neymar',
            assistant_phone: '08123456789',
            image: '../../../images/user4.png',
        },

        // Default
        {
            type: 'default',
            user_id: userId,
            description: JSON.stringify({
                defaultActivityList,
                transactionData,
                galleryImages,
                address,
                announcements,
            }),
        }
    ];

    await knex('landing_page_contents').insert(defaultContents);
};
